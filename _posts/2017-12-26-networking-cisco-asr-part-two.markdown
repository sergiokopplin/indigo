---
title: "Using the Cisco ASR1k Router Service Plugin in OpenStack - Part Two"
layout: post
date: 2017-12-26
image: /assets/images/2017-12-26-networking-cisco-asr-part-two/cisco_asr1001.png
headerImage: true
tag:
- blog
- neutron
- cisco
- asr
- l3 plugin
- openstack
- ocata
- router
blog: true
author: jamesdenton
description: Using the Cisco ASR1k Router Service Plugin in OpenStack - Part Two

---

In my last post, [Using the Cisco ASR1k Router Service Plugin in OpenStack - Part One](http://www.jimmdenton.com/networking-cisco-asr-install/), I demonstrated the installation of the Cisco ASR1k Router Service Plugin in an OpenStack environment deployed with RDO/Packstack. The latest tagged release of the plugin available [here](https://github.com/openstack/networking-cisco) is 5.3.0, which supports a range of OpenStack releases up to Ocata. 

In this post, I'd like to cover the essential steps of creating tenant routers using the OpenStack API, attaching interfaces to those routers, and observing how they are implemented on the ASR itself.
<!--more-->

This post assumes you successfully installed the ASR1k plugin and have the networking in place to facilitate a proper working tenant router. If not, that's OK. Just follow along!

# Getting started

In this environment, I'm starting out with four networks:

```
[root@rdo02-ocata ~(keystone_admin)]# neutron net-list --sort-key name
+--------------------------------------+--------------+----------------------------------+------------------------------------------------------+
| id                                   | name         | tenant_id                        | subnets                                              |
+--------------------------------------+--------------+----------------------------------+------------------------------------------------------+
| 4efa66d6-97ac-4235-ad6c-bc86644ae9b3 | external-net | 10ccb9b4ca954aefb004ede6d7816508 | ae1a3ec0-e760-426b-9617-3bdcd40199ff 192.168.70.0/24 |
| 673460a1-4980-461d-9975-cda463256803 | tenant1      | 10ccb9b4ca954aefb004ede6d7816508 | 94f16b00-7837-4fab-9ad7-295c6f1d0c37 172.16.0.0/24   |
| b629c9a8-427d-4bb3-b271-007715a05ff7 | tenant2      | 10ccb9b4ca954aefb004ede6d7816508 | 1acfd9a3-b006-4ae8-a1c0-6b7172a11847 172.18.0.0/24   |
| 1a990369-4b13-41f4-bb5b-944a774ff92d | tenant4      | 10ccb9b4ca954aefb004ede6d7816508 | d087bfef-f3bb-4079-912b-02297eff6b7e 172.20.0.0/24   |
+--------------------------------------+--------------+----------------------------------+------------------------------------------------------+
```

The `external-net` network is an *external provider network* whose gateway is a Cisco ASA edge firewall, while the `tenantN` networks are currently isolated and awaiting connection to a virtual router. All networks are VLAN-type with the following characteristics:

```
[root@rdo02-ocata ~(keystone_admin)]# neutron net-list --sort-key name -c name -c provider:network_type -c provider:segmentation_id
+--------------+-----------------------+--------------------------+
| name         | provider:network_type | provider:segmentation_id |
+--------------+-----------------------+--------------------------+
| external-net | vlan                  |                       70 |
| tenant1      | vlan                  |                      794 |
| tenant2      | vlan                  |                      793 |
| tenant4      | vlan                  |                      781 |
+--------------+-----------------------+--------------------------+
```

At this point, any instance connected to a tenant network would not have connectivity except to other instances in the same network. 

## Creating a router

Routers can be created using the `openstack` or `neutron` commands we all know and love:

```
openstack router create <router name>
neutron router-create <router name>
```

Here's an example:

```
[root@rdo02-ocata ~(keystone_admin)]# openstack router create router1
+-------------------------+--------------------------------------+
| Field                   | Value                                |
+-------------------------+--------------------------------------+
| admin_state_up          | UP                                   |
| availability_zone_hints | None                                 |
| availability_zones      | None                                 |
| created_at              | 2017-12-26T17:52:28Z                 |
| description             |                                      |
| distributed             | False                                |
| external_gateway_info   | None                                 |
| flavor_id               | None                                 |
| ha                      | False                                |
| id                      | 2e1bd846-6c1c-4f35-b771-0b58241c475b |
| name                    | router1                              |
| project_id              | 10ccb9b4ca954aefb004ede6d7816508     |
| revision_number         | None                                 |
| routes                  |                                      |
| status                  | ACTIVE                               |
| updated_at              | 2017-12-26T17:52:28Z                 |
+-------------------------+--------------------------------------+
```

When the router is created via the API, the Neutron server and Cisco CFG Agent work to create a configuration that will be applied to the ASR. The configuration is built using what are known as **snippets**, which are basically XML configuration templates that apply changes to particular devices. Looking at the CFG Agent log, we can see the router creation in action:

```
2017-12-26 17:52:30.457 26110 INFO ncclient.transport.ssh [-] Connected (version 2.0, client Cisco-1.25)
2017-12-26 17:52:30.897 26110 INFO ncclient.transport.ssh [-] Authentication (password) successful!
2017-12-26 17:52:30.903 26110 INFO ncclient.transport.session [-] initialized: session-id=2167890656 | server_capabilities=<dictionary-keyiterator object at 0x604c680>
2017-12-26 17:52:30.927 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] Config generated for [00000000-0000-0000-0000-000000000003] CREATE_VRF is:
<config>
        <cli-config-data>
            <cmd>vrf definition nrouter-2e1bd8</cmd>
            <cmd>address-family ipv4</cmd>
            <cmd>exit-address-family</cmd>
            <cmd>address-family ipv6</cmd>
            <cmd>exit-address-family</cmd>
        </cli-config-data>
</config>
 caller:networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver.ASR1kRoutingDriver._do_create_vrf
2017-12-26 17:52:30.928 26110 INFO ncclient.operations.rpc [-] Requesting 'EditConfig'
2017-12-26 17:52:31.042 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] CREATE_VRF was successfully executed
```
On the ASR device, a new VRF has been created:

```
asr-01#sh vrf
  Name                             Default RD            Protocols   Interfaces
  ...
  nrouter-2e1bd8                   <not set>             ipv4,ipv6


asr-01#sh run vrf nrouter-2e1bd8
Building configuration...

Current configuration : 131 bytes
vrf definition nrouter-2e1bd8
 !
 address-family ipv4
 exit-address-family
 !
 address-family ipv6
 exit-address-family
!
!
!
end
```

The name of the VRF has a prefix of `nrouter-` and a suffix containing the first six characters of the router ID.

## Attaching a gateway interface

Gateway interfaces can be attached to a virtual router with the following commands:

```
openstack router set <router name> --external-gateway <external network>
neutron router-gateway-set <router name> <external network>
```
Here's an example:

```
[root@rdo02-ocata ~(keystone_admin)]# openstack router set router1 --external-gateway external-net
[root@rdo02-ocata ~(keystone_admin)]#
```
No output is returned from the API when the command is successfully accepted. When an external interface is attached to the router, there are many different actions taking place according to the log.

First, a VLAN subinterface is enabled or created that corresponds to the external network:

```
2017-12-26 18:01:42.048 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] Config generated for [00000000-0000-0000-0000-000000000003] ENABLE_INTF is:
<config>
        <cli-config-data>
            <cmd>interface GigabitEthernet0/0/0.70</cmd>
            <cmd>no shutdown</cmd>
        </cli-config-data>
</config>
 caller:networking_cisco.plugins.cisco.cfg_agent.device_drivers.asr1k.asr1k_routing_driver.ASR1kRoutingDriver._enable_sub_interface
2017-12-26 18:01:42.051 26110 INFO ncclient.operations.rpc [-] Requesting 'EditConfig'
2017-12-26 18:01:42.116 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] ENABLE_INTF was successfully executed
```
Next, a NAT pool is created for this particular router. The router will perform source NAT on all outbound traffic using the IP specified in the NAT pool unless a floating IP has been assigned. This behavior mimics a namespace-based router that uses the IP assigned to its `qg` interface for outbound NAT purposes:

```
2017-12-26 18:01:42.119 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] Config generated for [00000000-0000-0000-0000-000000000003] CREATE_NAT_POOL is:
<config>
        <cli-config-data>
            <cmd>ip nat pool nrouter-2e1bd8_nat_pool 192.168.70.12 192.168.70.12 netmask 255.255.255.0</cmd>
        </cli-config-data>
</config>
 caller:networking_cisco.plugins.cisco.cfg_agent.device_drivers.asr1k.asr1k_routing_driver.ASR1kRoutingDriver._set_nat_pool
2017-12-26 18:01:42.120 26110 INFO ncclient.operations.rpc [-] Requesting 'EditConfig'
2017-12-26 18:01:42.235 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] CREATE_NAT_POOL was successfully executed
```
Then, a default route is added to the router's VRF that sends all outbound traffic to the gateway IP specified in the external network's subnet details:

```
2017-12-26 18:01:42.237 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] Config generated for [00000000-0000-0000-0000-000000000003] SET_DEFAULT_ROUTE_WITH_INTF is:
<config>
        <cli-config-data>
            <cmd>ip route vrf nrouter-2e1bd8 0.0.0.0 0.0.0.0 GigabitEthernet0/0/0.70 192.168.70.1</cmd>
        </cli-config-data>
</config>
 caller:networking_cisco.plugins.cisco.cfg_agent.device_drivers.asr1k.asr1k_routing_driver.ASR1kRoutingDriver._add_default_route
2017-12-26 18:01:42.238 26110 INFO ncclient.operations.rpc [-] Requesting 'EditConfig'
2017-12-26 18:01:42.353 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] SET_DEFAULT_ROUTE_WITH_INTF was successfully executed
```
After that, the agent again enables the interface:

```
2017-12-26 18:01:42.404 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] Config generated for [00000000-0000-0000-0000-000000000003] ENABLE_INTF is:
<config>
        <cli-config-data>
            <cmd>interface GigabitEthernet0/0/0.70</cmd>
            <cmd>no shutdown</cmd>
        </cli-config-data>
</config>
 caller:networking_cisco.plugins.cisco.cfg_agent.device_drivers.asr1k.asr1k_routing_driver.ASR1kRoutingDriver._enable_sub_interface
2017-12-26 18:01:42.406 26110 INFO ncclient.operations.rpc [-] Requesting 'EditConfig'
2017-12-26 18:01:42.438 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] ENABLE_INTF was successfully executed
```
Next, an IP address is configured on the VLAN subinterface and the interface is tagged according to the VLAN ID of the external network in Neutron:

```
2017-12-26 18:01:43.255 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] Config generated for [00000000-0000-0000-0000-000000000003] CREATE_SUBINTERFACE_WITH_ID is:
<config>
        <cli-config-data>
            <cmd>interface GigabitEthernet0/0/0.70</cmd>
            <cmd>description OPENSTACK_NEUTRON_EXTERNAL_INTF</cmd>
            <cmd>encapsulation dot1Q 70</cmd>
            <cmd>ip address 192.168.70.6 255.255.255.0</cmd>
        </cli-config-data>
</config>
 caller:networking_cisco.plugins.cisco.cfg_agent.device_drivers.asr1k.asr1k_routing_driver.ASR1kRoutingDriver._do_create_external_sub_interface
2017-12-26 18:01:43.256 26110 INFO ncclient.operations.rpc [-] Requesting 'EditConfig'
2017-12-26 18:01:43.370 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] CREATE_SUBINTERFACE_WITH_ID was successfully executed
```

Finally, the agent applies an HSRP configuration to the subinterface:

```
2017-12-26 18:01:43.371 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] Config generated for [00000000-0000-0000-0000-000000000003] SET_INTC_ASR_HSRP_EXTERNAL is:
<config>
        <cli-config-data>
            <cmd>interface GigabitEthernet0/0/0.70</cmd>
            <cmd>standby version 2</cmd>
            <cmd>standby delay minimum 30 reload 60</cmd>
            <cmd>standby 1064 priority 100</cmd>
            <cmd>standby 1064 ip 192.168.70.11</cmd>
            <cmd>standby 1064 timers 1 3</cmd>
            <cmd>standby 1064 name neutron-hsrp-1064-70</cmd>
        </cli-config-data>
</config>
 caller:networking_cisco.plugins.cisco.cfg_agent.device_drivers.asr1k.asr1k_routing_driver.ASR1kRoutingDriver._do_add_ha_hsrp_asr1k
2017-12-26 18:01:43.371 26110 INFO ncclient.operations.rpc [-] Requesting 'EditConfig'
2017-12-26 18:01:43.486 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] SET_INTC_ASR_HSRP_EXTERNAL was successfully executed
```
On the ASR, we can see the configuration as written:

```
interface GigabitEthernet0/0/0.70
 description OPENSTACK_NEUTRON_EXTERNAL_INTF
 encapsulation dot1Q 70
 ip address 192.168.70.6 255.255.255.0
 standby delay minimum 30 reload 60
 standby version 2
 standby 1064 ip 192.168.70.11
 standby 1064 timers 1 3
 standby 1064 name neutron-hsrp-1064-70
...
ip nat pool nrouter-2e1bd8_nat_pool 192.168.70.12 192.168.70.12 netmask 255.255.255.0
...
ip route vrf nrouter-2e1bd8 0.0.0.0 0.0.0.0 GigabitEthernet0/0/0.70 192.168.70.1
...
```
This environment uses a standalone ASR, so the HSRP configuration is unnecessary but unconfigurable as far as I can tell. Only one external subinterface will be created for *any given* external network. Each router, however, will have its own respective NAT pool with an IP address that corresponds to that particular router.


### A closer look at Neutron

If we take a look at the Neutron router list at this point, two routers have appeared in the list that were not created by me:

```
[root@rdo02-ocata ~(keystone_admin)]# openstack router list
+--------------------------------------+---------------------------------+--------+-------+-------------+-------+----------------------------------+
| ID                                   | Name                            | Status | State | Distributed | HA    | Project                          |
+--------------------------------------+---------------------------------+--------+-------+-------------+-------+----------------------------------+
| 2cbe17f3-2bb1-4cb4-988f-5d7d6c66b161 | Logical-Global-router           | ACTIVE | UP    | False       | False |                                  |
| 2e1bd846-6c1c-4f35-b771-0b58241c475b | router1                         | ACTIVE | UP    | False       | False | 10ccb9b4ca954aefb004ede6d7816508 |
| d13e18cc-e157-4593-a2be-50b2e7fb3cce | Global-router-0000-000000000003 | ACTIVE | UP    | False       | False |                                  |
+--------------------------------------+---------------------------------+--------+-------+-------------+-------+----------------------------------+
```

The router known as `Global-router-0000-000000000003` is an object that represents the physical ASR device. A glimpse at its port list reveals the following:

```
[root@rdo02-ocata ~(keystone_admin)]# openstack port list --router d13e18cc-e157-4593-a2be-50b2e7fb3cce
+--------------------------------------+------+-------------------+-----------------------------------------------------------------------------+--------+
| ID                                   | Name | MAC Address       | Fixed IP Addresses                                                          | Status |
+--------------------------------------+------+-------------------+-----------------------------------------------------------------------------+--------+
| a8f14fca-aa80-4b0c-8345-9f5d43865f11 |      | fa:16:3e:ff:8f:ee | ip_address='192.168.70.6', subnet_id='ae1a3ec0-e760-426b-9617-3bdcd40199ff' | ACTIVE |
+--------------------------------------+------+-------------------+-----------------------------------------------------------------------------+--------+
```

Take a look at the IP address: `192.168.70.6`. That IP corresponds to the one applied to the VLAN subinterface shown here:

```
interface GigabitEthernet0/0/0.70
 description OPENSTACK_NEUTRON_EXTERNAL_INTF
 encapsulation dot1Q 70
 ip address 192.168.70.6 255.255.255.0
 standby delay minimum 30 reload 60
 standby version 2
 standby 1064 ip 192.168.70.11
 standby 1064 timers 1 3
 standby 1064 name neutron-hsrp-1064-70
end
```

It turns out that *any* IP address associated with an external network subinterface is mapped to a Neutron port that is owned by the Global router object. 

The router known as `Logical-Global-router` behaves similarly, but appears to be used as a dummy object for HSRP addresses instead:

```
[root@rdo02-ocata ~(keystone_admin)]# openstack port list --router 2cbe17f3-2bb1-4cb4-988f-5d7d6c66b161
+--------------------------------------+------+-------------------+------------------------------------------------------------------------------+--------+
| ID                                   | Name | MAC Address       | Fixed IP Addresses                                                           | Status |
+--------------------------------------+------+-------------------+------------------------------------------------------------------------------+--------+
| 164862c2-36b2-4718-a240-f368f5fb250b |      | fa:16:3e:2d:29:4e | ip_address='192.168.70.11', subnet_id='ae1a3ec0-e760-426b-9617-3bdcd40199ff' | DOWN   |
+--------------------------------------+------+-------------------+------------------------------------------------------------------------------+--------+
```

The IP, `192.168.70.11`, is defined as the HSRP for the `GigabitEthernet0/0/0.70` interface shown above.

## Attaching an internal interface

Internal interfaces can be attached to a virtual router with the following commands:

```
openstack router add subnet <router name> <subnet name>
neutron router-interface-add <router name> <subnet name>
```
Here's an example:

```
[root@rdo02-ocata ~(keystone_admin)]# openstack router add subnet router1 subnet1
[root@rdo02-ocata ~(keystone_admin)]#
```
No output is returned from the API when the command is successfully accepted. When an internal interface is attached to the router, there are many different actions taking place according to the log.

First, a VLAN subinterface is enabled or created that corresponds to the *internal* network:

```
2017-12-26 18:25:01.517 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] Config generated for [00000000-0000-0000-0000-000000000003] CREATE_SUBINTERFACE_WITH_ID is:
<config>
        <cli-config-data>
            <cmd>interface GigabitEthernet0/0/2.794</cmd>
            <cmd>description OPENSTACK_NEUTRON_INTF</cmd>
            <cmd>encapsulation dot1Q 794</cmd>
            <cmd>vrf forwarding nrouter-2e1bd8</cmd>
            <cmd>ip address 172.16.0.1 255.255.255.0</cmd>
        </cli-config-data>
</config>
 caller:networking_cisco.plugins.cisco.cfg_agent.device_drivers.asr1k.asr1k_routing_driver.ASR1kRoutingDriver._do_create_sub_interface
2017-12-26 18:25:01.521 26110 INFO ncclient.operations.rpc [-] Requesting 'EditConfig'
2017-12-26 18:25:01.538 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] CREATE_SUBINTERFACE_WITH_ID was successfully executed
```

The interface is tagged with a VLAN that corresponds to the internal network and the IP address assigned corresponds to the gateway address of the subnet. The subinterface is placed into the respective VRF on the ASR. As expected, the interface does not contain any HSRP configuration since HA is False.

Next, an access list is created that defines the attached subnet:

```
2017-12-26 18:25:01.538 26110 INFO ncclient.operations.rpc [-] Requesting 'GetConfig'
2017-12-26 18:25:01.963 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] Config generated for [00000000-0000-0000-0000-000000000003] CREATE_ACL is:
<config>
        <cli-config-data>
            <cmd>ip access-list standard neutron_acl_794_8e2d8a05</cmd>
            <cmd>permit 172.16.0.0 0.0.0.255</cmd>
        </cli-config-data>
</config>
 caller:networking_cisco.plugins.cisco.cfg_agent.device_drivers.asr1k.asr1k_routing_driver.ASR1kRoutingDriver._nat_rules_for_internet_access
2017-12-26 18:25:01.964 26110 INFO ncclient.operations.rpc [-] Requesting 'EditConfig'
2017-12-26 18:25:02.079 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] CREATE_ACL was successfully executed
```

Then, an overload NAT is created that uses the NAT pool created when the external network was attached to the router and limits the NAT to that of the subnet defined in the ACL:

```
2017-12-26 18:25:02.079 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] Config generated for [00000000-0000-0000-0000-000000000003] SET_DYN_SRC_TRL_POOL is:
<config>
        <cli-config-data>
            <cmd>ip nat inside source list neutron_acl_794_8e2d8a05 pool nrouter-2e1bd8_nat_pool vrf nrouter-2e1bd8 overload</cmd>
        </cli-config-data>
</config>
 caller:networking_cisco.plugins.cisco.cfg_agent.device_drivers.asr1k.asr1k_routing_driver.ASR1kRoutingDriver._nat_rules_for_internet_access
2017-12-26 18:25:02.080 26110 INFO ncclient.operations.rpc [-] Requesting 'EditConfig'
2017-12-26 18:25:02.144 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] SET_DYN_SRC_TRL_POOL was successfully executed
```

After that, a `nat inside` statement is applied to the *internal* subinterface:

```
2017-12-26 18:25:02.145 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] Config generated for [00000000-0000-0000-0000-000000000003] SET_NAT is:
<config>
        <cli-config-data>
            <cmd>interface GigabitEthernet0/0/2.794</cmd>
            <cmd>ip nat inside</cmd>
        </cli-config-data>
</config>
 caller:networking_cisco.plugins.cisco.cfg_agent.device_drivers.asr1k.asr1k_routing_driver.ASR1kRoutingDriver._nat_rules_for_internet_access
2017-12-26 18:25:02.145 26110 INFO ncclient.operations.rpc [-] Requesting 'EditConfig'
2017-12-26 18:25:02.260 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] SET_NAT was successfully executed
```

Then, a `nat outside` statement is applied to the *external* subinterface:

```
2017-12-26 18:25:02.261 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] Config generated for [00000000-0000-0000-0000-000000000003] SET_NAT is:
<config>
        <cli-config-data>
            <cmd>interface GigabitEthernet0/0/0.70</cmd>
            <cmd>ip nat outside</cmd>
        </cli-config-data>
</config>
 caller:networking_cisco.plugins.cisco.cfg_agent.device_drivers.asr1k.asr1k_routing_driver.ASR1kRoutingDriver._nat_rules_for_internet_access
2017-12-26 18:25:02.261 26110 INFO ncclient.operations.rpc [-] Requesting 'EditConfig'
2017-12-26 18:25:02.377 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] SET_NAT was successfully executed
```

Finally, the interfaces are enabled for good measure:

```
2017-12-26 18:25:02.422 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] Config generated for [00000000-0000-0000-0000-000000000003] ENABLE_INTF is:
<config>
        <cli-config-data>
            <cmd>interface GigabitEthernet0/0/0.70</cmd>
            <cmd>no shutdown</cmd>
        </cli-config-data>
</config>
 caller:networking_cisco.plugins.cisco.cfg_agent.device_drivers.asr1k.asr1k_routing_driver.ASR1kRoutingDriver._enable_sub_interface
2017-12-26 18:25:02.422 26110 INFO ncclient.operations.rpc [-] Requesting 'EditConfig'
2017-12-26 18:25:02.454 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] ENABLE_INTF was successfully executed
2017-12-26 18:25:02.455 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] Config generated for [00000000-0000-0000-0000-000000000003] ENABLE_INTF is:
<config>
        <cli-config-data>
            <cmd>interface GigabitEthernet0/0/2.794</cmd>
            <cmd>no shutdown</cmd>
        </cli-config-data>
</config>
 caller:networking_cisco.plugins.cisco.cfg_agent.device_drivers.asr1k.asr1k_routing_driver.ASR1kRoutingDriver._enable_sub_interface
2017-12-26 18:25:02.455 26110 INFO ncclient.operations.rpc [-] Requesting 'EditConfig'
2017-12-26 18:25:02.569 26110 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] ENABLE_INTF was successfully executed
```
On the ASR, we can now see the entire configuration that has been applied by Neutron and the Cisco CFG Agent:

```
vrf definition nrouter-2e1bd8
 !
 address-family ipv4
 exit-address-family
 !
 address-family ipv6
 exit-address-family
!
...
interface GigabitEthernet0/0/0.70
 description OPENSTACK_NEUTRON_EXTERNAL_INTF
 encapsulation dot1Q 70
 ip address 192.168.70.6 255.255.255.0
 ip nat outside
 standby delay minimum 30 reload 60
 standby version 2
 standby 1064 ip 192.168.70.11
 standby 1064 timers 1 3
 standby 1064 name neutron-hsrp-1064-70
...
interface GigabitEthernet0/0/2.794
 description OPENSTACK_NEUTRON_INTF
 encapsulation dot1Q 794
 vrf forwarding nrouter-2e1bd8
 ip address 172.16.0.1 255.255.255.0
 ip nat inside
...
ip nat pool nrouter-2e1bd8_nat_pool 192.168.70.12 192.168.70.12 netmask 255.255.255.0
ip nat inside source list neutron_acl_794_8e2d8a05 pool nrouter-2e1bd8_nat_pool vrf nrouter-2e1bd8 overload
...
ip route vrf nrouter-2e1bd8 0.0.0.0 0.0.0.0 GigabitEthernet0/0/0.70 192.168.70.1
...
ip access-list standard neutron_acl_794_8e2d8a05
 permit 172.16.0.0 0.0.0.255
...
```

## Verifying

In my environment, I have spun up a CirrOS instance in the `tenant1` network that is now attached to the router implemented in the ASR. Logging in via the DHCP namespace, I can verify proper operation of the router by issuing a ping out to the Internet:

```
[root@rdo02-ocata ~(keystone_admin)]# ip netns exec qdhcp-673460a1-4980-461d-9975-cda463256803 ssh cirros@172.16.0.5
cirros@172.16.0.5's password:
$ ping 8.8.8.8 -c 5
PING 8.8.8.8 (8.8.8.8): 56 data bytes
64 bytes from 8.8.8.8: seq=0 ttl=56 time=31.452 ms
64 bytes from 8.8.8.8: seq=1 ttl=56 time=29.452 ms
64 bytes from 8.8.8.8: seq=2 ttl=56 time=28.286 ms
64 bytes from 8.8.8.8: seq=3 ttl=56 time=28.351 ms
64 bytes from 8.8.8.8: seq=4 ttl=56 time=28.349 ms

--- 8.8.8.8 ping statistics ---
5 packets transmitted, 5 packets received, 0% packet loss
round-trip min/avg/max = 28.286/29.178/31.452 ms
```

A real-time packet capture on the Cisco ASA reveals traffic being properly NAT'd out as the IP address defined in the `nrouter-2e1bd8_nat_pool` NAT pool:

```
ciscoasa-5506# capture pingtest interface ASR.70 real-time match icmp any any
...
   1: 18:45:35.140007       802.1Q vlan#70 P0 192.168.70.12 > 8.8.8.8: icmp: echo request
   2: 18:45:35.167044       802.1Q vlan#70 P0 8.8.8.8 > 192.168.70.12: icmp: echo reply
   3: 18:45:36.141487       802.1Q vlan#70 P0 192.168.70.12 > 8.8.8.8: icmp: echo request
   4: 18:45:36.168539       802.1Q vlan#70 P0 8.8.8.8 > 192.168.70.12: icmp: echo reply
   5: 18:45:37.143577       802.1Q vlan#70 P0 192.168.70.12 > 8.8.8.8: icmp: echo request
   6: 18:45:37.170767       802.1Q vlan#70 P0 8.8.8.8 > 192.168.70.12: icmp: echo reply
   7: 18:45:38.144706       802.1Q vlan#70 P0 192.168.70.12 > 8.8.8.8: icmp: echo request
   8: 18:45:38.171728       802.1Q vlan#70 P0 8.8.8.8 > 192.168.70.12: icmp: echo reply
   9: 18:45:39.145805       802.1Q vlan#70 P0 192.168.70.12 > 8.8.8.8: icmp: echo request
  10: 18:45:39.172690       802.1Q vlan#70 P0 8.8.8.8 > 192.168.70.12: icmp: echo reply
...
```

# Summary

In a perfect world, this would all work as I have demonstrated here. The truth is, I ran into some bugs related to HA and reported them [here](https://bugs.launchpad.net/networking-cisco/+bug/1739768). My environment has been patched to work around the issue, which likely stems from me using a standalone device.

You may have noticed the duplication of events or commands in the logs, such as `ENABLE_INTF`. As far as I can tell, the agent does not really take into consideration the state of an object on the ASR, but rather re-applies configurations it knows need to be there. Keep in mind, too, that there is an expecation that objects managed by Neutron will not be modified by hand on the physical device. Doing so may result in the revertion of those changes, or worse, tracebacks and a broken agent.

The number of routers that can be created in a particular environment may vary based on the specs of the configured Cisco ASR. It likely numbers into the thousands, though, even for the lowly ASR 1001. 

If you run into a bug or operation that results in a traceback, the routers may not be implemented properly and may not work at all. Until the issue is resolved, the agent may forever be unable to move forward with the changes being reverted or the agent being restarted. Be sure to check the Neutron and Cisco CFG Agent logs when things aren't working as expected.

The next blog in this series will walk through the process of creating and assigning Floating IPs using the OpenStack API. We'll take a look at how floating IPs are constructed on the Cisco ASR device, and maybe cover some other details or gotchas that we run into. In the meantime, feel free to hit me up on Twitter at @jimmdenton with any questions or corrections.
