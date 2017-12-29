---
title: "Using the Cisco ASR1k Router Service Plugin in OpenStack - Part Three"
layout: post
date: 2017-12-28
image: /assets/images/2017-12-28-networking-cisco-asr-part-three/cisco_asr1001.png
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
description: Using the Cisco ASR1k Router Service Plugin in OpenStack - Part Three

---

In part two of this series, [Using the Cisco ASR1k Router Service Plugin in OpenStack - Part Two](http://www.jimmdenton.com/networking-cisco-asr-part-two/), I left off with having demonstrated how routers created using the Neutron API are implemented as VRFs in a Cisco Aggregated Services Router (ASR). A ping out to Google from a connected instance was successful, and the edge firewall verified traffic was being properly source NAT'd thanks to a NAT overload on the ASR.
<!--more-->

Well, that's all fine and dandy, but how do we actually reach the *instance*?

This post assumes you successfully installed the ASR1k plugin and have the networking in place to facilitate a proper working tenant router and all of the associated functions. If not, that's OK. Just follow along!

# Enter Floating IPs

In OpenStack, a floating IP is nothing more than a static network address translation (NAT) that is created and managed by a user via the Neutron API. There are a few of requirements for floating IPs:

* An external provider network
* ... must be connected to a virtual router 
* ... which in turn must be connected to a tenant network

In [Part Two](http://www.jimmdenton.com/networking-cisco-asr-part-two/) of this series, I demonstrated the creation of a virtual router using the `openstack router create` command, and connected it to a pre-created external network known as `external-net`:

```
[root@rdo02-ocata ~(keystone_admin)]# neutron net-external-list
+--------------------------------------+---------------+----------------------------------+------------------------------------------------------+
| id                                   | name          | tenant_id                        | subnets                                              |
+--------------------------------------+---------------+----------------------------------+------------------------------------------------------+
| 4efa66d6-97ac-4235-ad6c-bc86644ae9b3 | external-net  | 10ccb9b4ca954aefb004ede6d7816508 | ae1a3ec0-e760-426b-9617-3bdcd40199ff 192.168.70.0/24 |
+--------------------------------------+---------------+----------------------------------+------------------------------------------------------+
```

The properties of this network are important. Its `router:external` attribute is `True`, making it eligible for use as a floating IP pool. In addition, it is directly connected to the edge firewall in my network, making it accessible from other networks, including the one my workstation is connected to.

The tenant network, on the other hand, was a completely isolated VLAN network prior to connecting it to the virtual router known as `router1` in [Part Two](http://www.jimmdenton.com/networking-cisco-asr-part-two/) of this series. At this point, the router has two interfaces - one external and one internal:

```
[root@rdo02-ocata ~(keystone_admin)]# openstack port list --router 2e1bd846-6c1c-4f35-b771-0b58241c475b
+--------------------------------------+------+-------------------+------------------------------------------------------------------------------+--------+
| ID                                   | Name | MAC Address       | Fixed IP Addresses                                                           | Status |
+--------------------------------------+------+-------------------+------------------------------------------------------------------------------+--------+
| 0a16cbd6-b4a1-40f4-93c5-c44f747efd29 |      | fa:16:3e:80:09:b9 | ip_address='192.168.70.12', subnet_id='ae1a3ec0-e760-426b-9617-3bdcd40199ff' | ACTIVE |
| 8e2d8a05-e09c-42bd-ba3e-fa48cfca9b3b |      | fa:16:3e:58:12:2c | ip_address='172.16.0.1', subnet_id='94f16b00-7837-4fab-9ad7-295c6f1d0c37'    | ACTIVE |
+--------------------------------------+------+-------------------+------------------------------------------------------------------------------+--------+
```

## Creating and associating floating IPs

A floating IP is procured from an *external provider network* address pool and is associated with a Neutron port. Usually, the port belongs to an instance, but it can also belong to a load balancer created with the LBaaS API or some other virtual device.

In this environment, I'm working with a single instance:

```
[root@rdo02-ocata ~(keystone_admin)]# openstack server list
+--------------------------------------+---------+--------+--------------------+------------+
| ID                                   | Name    | Status | Networks           | Image Name |
+--------------------------------------+---------+--------+--------------------+------------+
| 190558c0-df78-4556-befb-eaf760a37805 | cirros1 | ACTIVE | tenant1=172.16.0.5 | cirros     |
+--------------------------------------+---------+--------+--------------------+------------+
```

I can confirm that I do *not* have reachability from my firewall or workstation:

```
retina-imac:~ jdenton$ ping 172.16.0.5 -c 5
PING 172.16.0.5 (172.16.0.5): 56 data bytes
Request timeout for icmp_seq 0
Request timeout for icmp_seq 1
Request timeout for icmp_seq 2
Request timeout for icmp_seq 3

--- 172.16.0.5 ping statistics ---
5 packets transmitted, 0 packets received, 100.0% packet loss

ciscoasa-5506# ping 172.16.0.5
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 172.16.0.5, timeout is 2 seconds:
?????
Success rate is 0 percent (0/5)
```

Using the OpenStack API, I must first determine the port ID associated with my instance before assigning a floating IP:

```
[root@rdo02-ocata ~(keystone_admin)]# openstack port list --server cirros1
+--------------------------------------+------+-------------------+---------------------------------------------------------------------------+--------+
| ID                                   | Name | MAC Address       | Fixed IP Addresses                                                        | Status |
+--------------------------------------+------+-------------------+---------------------------------------------------------------------------+--------+
| 63eb4e84-ab4f-4ba7-8c7c-b327a13c88d7 |      | fa:16:3e:f0:27:1e | ip_address='172.16.0.5', subnet_id='94f16b00-7837-4fab-9ad7-295c6f1d0c37' | ACTIVE |
+--------------------------------------+------+-------------------+---------------------------------------------------------------------------+--------+
```

Once the port ID is known, the creation and association of a floating IP can be done in a single step:

```
[root@rdo02-ocata ~(keystone_admin)]# openstack floating ip create --port 63eb4e84-ab4f-4ba7-8c7c-b327a13c88d7 external-net
+---------------------+--------------------------------------+
| Field               | Value                                |
+---------------------+--------------------------------------+
| created_at          | 2017-12-29T01:49:27Z                 |
| description         |                                      |
| fixed_ip_address    | 172.16.0.5                           |
| floating_ip_address | 192.168.70.4                         |
| floating_network_id | 4efa66d6-97ac-4235-ad6c-bc86644ae9b3 |
| id                  | 94ee070e-1a47-41bb-b34d-c45a9cf4970a |
| name                | None                                 |
| port_id             | 63eb4e84-ab4f-4ba7-8c7c-b327a13c88d7 |
| project_id          | 10ccb9b4ca954aefb004ede6d7816508     |
| revision_number     | 1                                    |
| router_id           | 2e1bd846-6c1c-4f35-b771-0b58241c475b |
| status              | ACTIVE                               |
| updated_at          | 2017-12-29T01:49:27Z                 |
+---------------------+--------------------------------------+
```

In the Cisco CFG Agent log, we can see a static NAT has been created and the two router interfaces have been touched:

```
2017-12-29 01:49:36.750 9661 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] Config generated for [00000000-0000-0000-0000-000000000003] SET_STATIC_SRC_TRL_NO_VRF_MATCH is:
<config>
        <cli-config-data>
            <cmd>ip nat inside source static 172.16.0.5 192.168.70.4 vrf nrouter-2e1bd8</cmd> # NOQA
        </cli-config-data>
</config>
 caller:networking_cisco.plugins.cisco.cfg_agent.device_drivers.asr1k.asr1k_routing_driver.ASR1kRoutingDriver._do_add_floating_ip_asr1k
2017-12-29 01:49:36.750 9661 INFO ncclient.operations.rpc [-] Requesting 'EditConfig'
2017-12-29 01:49:36.782 9661 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] SET_STATIC_SRC_TRL_NO_VRF_MATCH was successfully executed
2017-12-29 01:49:36.810 9661 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] Config generated for [00000000-0000-0000-0000-000000000003] ENABLE_INTF is:
<config>
        <cli-config-data>
            <cmd>interface GigabitEthernet0/0/0.70</cmd>
            <cmd>no shutdown</cmd>
        </cli-config-data>
</config>
 caller:networking_cisco.plugins.cisco.cfg_agent.device_drivers.asr1k.asr1k_routing_driver.ASR1kRoutingDriver._enable_sub_interface
2017-12-29 01:49:36.811 9661 INFO ncclient.operations.rpc [-] Requesting 'EditConfig'
2017-12-29 01:49:36.926 9661 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] ENABLE_INTF was successfully executed
2017-12-29 01:49:36.928 9661 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] Config generated for [00000000-0000-0000-0000-000000000003] ENABLE_INTF is:
<config>
        <cli-config-data>
            <cmd>interface GigabitEthernet0/0/2.794</cmd>
            <cmd>no shutdown</cmd>
        </cli-config-data>
</config>
 caller:networking_cisco.plugins.cisco.cfg_agent.device_drivers.asr1k.asr1k_routing_driver.ASR1kRoutingDriver._enable_sub_interface
2017-12-29 01:49:36.928 9661 INFO ncclient.operations.rpc [-] Requesting 'EditConfig'
2017-12-29 01:49:36.994 9661 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] ENABLE_INTF was successfully executed
```

On the router itself, the following configuration is now in place:

```
asr-01#sh run
...
ip nat inside source static 172.16.0.5 192.168.70.4 vrf nrouter-2e1bd8
...

asr-01#sh ip nat translations vrf nrouter-2e1bd8
Pro  Inside global         Inside local          Outside local         Outside global
---  192.168.70.4          172.16.0.5            ---                   ---
Total number of translations: 1
```

## Verifying connectivity

With our floating IP in place, it is now time to verify connectivity from a couple of difference places. 

First, a ping from the edge firewall should be tested:

```
ciscoasa-5506# ping 192.168.70.4
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 192.168.70.4, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/10 ms
```

Next, connectivity from my workstation should prove successful:

```
retina-imac:~ jdenton$ ssh cirros@192.168.70.4
The authenticity of host '192.168.70.4 (192.168.70.4)' can't be established.
ECDSA key fingerprint is SHA256:bOWGDTMlId+ovYKNJPt3tk5DroFOkhmJttQAbFwtVPg.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '192.168.70.4' (ECDSA) to the list of known hosts.
cirros@192.168.70.4's password:
$ whoami
cirros
```

Finally, verify outbound connectivity still works:

```
$ ping 8.8.8.8 -c 5
PING 8.8.8.8 (8.8.8.8): 56 data bytes
64 bytes from 8.8.8.8: seq=0 ttl=56 time=29.495 ms
64 bytes from 8.8.8.8: seq=1 ttl=56 time=29.270 ms
64 bytes from 8.8.8.8: seq=2 ttl=56 time=28.368 ms
64 bytes from 8.8.8.8: seq=3 ttl=56 time=29.529 ms
64 bytes from 8.8.8.8: seq=4 ttl=56 time=30.914 ms

--- 8.8.8.8 ping statistics ---
5 packets transmitted, 5 packets received, 0% packet loss
round-trip min/avg/max = 28.368/29.515/30.914 ms
```

The ASA confirms outbound traffic from the instance appears as the floating IP and not the SNAT address:

```
   1: 02:14:04.991922       802.1Q vlan#70 P0 192.168.70.4 > 8.8.8.8: icmp: echo request
   2: 02:14:05.019225       802.1Q vlan#70 P0 8.8.8.8 > 192.168.70.4: icmp: echo reply
   3: 02:14:05.992914       802.1Q vlan#70 P0 192.168.70.4 > 8.8.8.8: icmp: echo request
   4: 02:14:06.020659       802.1Q vlan#70 P0 8.8.8.8 > 192.168.70.4: icmp: echo reply
   5: 02:14:06.993585       802.1Q vlan#70 P0 192.168.70.4 > 8.8.8.8: icmp: echo request
   6: 02:14:07.020445       802.1Q vlan#70 P0 8.8.8.8 > 192.168.70.4: icmp: echo reply
   7: 02:14:07.994409       802.1Q vlan#70 P0 192.168.70.4 > 8.8.8.8: icmp: echo request
   8: 02:14:08.022200       802.1Q vlan#70 P0 8.8.8.8 > 192.168.70.4: icmp: echo reply
   9: 02:14:08.995050       802.1Q vlan#70 P0 192.168.70.4 > 8.8.8.8: icmp: echo request
  10: 02:14:09.024611       802.1Q vlan#70 P0 8.8.8.8 > 192.168.70.4: icmp: echo reply
```  

Keep in mind, security group rules still apply, so you'll want to make sure access is allowed accordingly.

# What about routes?

Neutron routers support static routes via the `openstack router set` command shown here:

```
openstack router set --route destination=<subnet>,gateway=<ip-address> <router>
```

Multiple static routes are supported using the following syntax:

```
openstack router set \
--route destination=<subnet>,gateway=<ip-address> \
--route destination=<subnet>,gateway=<ip-address> \
...
--route destination=<subnet>,gateway=<ip-address> \
<router>
```

Likewise, they can now be removed individually using the `openstack router unset` command. In a standard network namespace implementation, each static route is created inside the respective router namespace. In a Cisco ASR implementation, each static route is added to the respective VRF. 

## Creating a static route

In the VRF that represents `router1`, the route table is pretty straightforward:

```
asr-01#sh ip route vrf nrouter-2e1bd8
...
Gateway of last resort is 192.168.70.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 192.168.70.1, GigabitEthernet0/0/0.70
      172.16.0.0/16 is variably subnetted, 2 subnets, 2 masks
C        172.16.0.0/24 is directly connected, GigabitEthernet0/0/2.794
L        172.16.0.1/32 is directly connected, GigabitEthernet0/0/2.794
```

A default route exists that sends all traffic from connected networks to the Cisco ASA at `192.168.70.1`.

### What we *can* do

Let's create a static route that sends traffic destined to `192.168.250.0/24` to a non-existant host in the *internal* network:

```
openstack router set \
--route destination=192.168.250.0/24,gateway=172.16.0.254 \
router1
```

No output is returned upon successful acceptance of the command, but we can see in our Cisco CFG agent log that the router's interfaces were touched and the static route was created in the `nrouter-2e1bd8` VRF:

```
2017-12-29 02:41:18.888 10484 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] Config generated for [00000000-0000-0000-0000-000000000003] ENABLE_INTF is:
<config>
        <cli-config-data>
            <cmd>interface GigabitEthernet0/0/0.70</cmd>
            <cmd>no shutdown</cmd>
        </cli-config-data>
</config>
 caller:networking_cisco.plugins.cisco.cfg_agent.device_drivers.asr1k.asr1k_routing_driver.ASR1kRoutingDriver._enable_sub_interface
2017-12-29 02:41:18.888 10484 INFO ncclient.operations.rpc [-] Requesting 'EditConfig'
2017-12-29 02:41:19.003 10484 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] ENABLE_INTF was successfully executed
2017-12-29 02:41:19.005 10484 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] Config generated for [00000000-0000-0000-0000-000000000003] ENABLE_INTF is:
<config>
        <cli-config-data>
            <cmd>interface GigabitEthernet0/0/2.794</cmd>
            <cmd>no shutdown</cmd>
        </cli-config-data>
</config>
 caller:networking_cisco.plugins.cisco.cfg_agent.device_drivers.asr1k.asr1k_routing_driver.ASR1kRoutingDriver._enable_sub_interface
2017-12-29 02:41:19.006 10484 INFO ncclient.operations.rpc [-] Requesting 'EditConfig'
2017-12-29 02:41:19.121 10484 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] ENABLE_INTF was successfully executed
2017-12-29 02:41:19.123 10484 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] Config generated for [00000000-0000-0000-0000-000000000003] SET_IP_ROUTE is:
<config>
        <cli-config-data>
            <cmd>ip route vrf nrouter-2e1bd8 192.168.250.0 255.255.255.0 172.16.0.254</cmd>
        </cli-config-data>
</config>
 caller:networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver.ASR1kRoutingDriver._add_static_route
2017-12-29 02:41:19.125 10484 INFO ncclient.operations.rpc [-] Requesting 'EditConfig'
2017-12-29 02:41:19.240 10484 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] SET_IP_ROUTE was successfully executed
```

As expected, the route shows up in the VRF's route table:

```
asr-01#sh ip route vrf nrouter-2e1bd8
...
Gateway of last resort is 192.168.70.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 192.168.70.1, GigabitEthernet0/0/0.70
      172.16.0.0/16 is variably subnetted, 2 subnets, 2 masks
C        172.16.0.0/24 is directly connected, GigabitEthernet0/0/2.794
L        172.16.0.1/32 is directly connected, GigabitEthernet0/0/2.794
S     192.168.250.0/24 [1/0] via 172.16.0.254
```

A route to `192.168.250.0/24` via `172.16.0.254` has been added. Great success!

### What we *can't* do

Now, let's create a static route that sends traffic destined to `10.0.0.0/8` to a non-existant host in the *external provider network*:

```
openstack router set \
--route destination=10.0.0.0/8,gateway=192.168.70.254 \
router1
```

No output is returned upon successful acceptance of the command, but we can see in our Cisco CFG agent log the router interfaces were touched and the static route was created in the `nrouter-2e1bd8` VRF:

```
...
2017-12-29 02:30:39.024 10484 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] ENABLE_INTF was successfully executed
...
2017-12-29 02:30:39.139 10484 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] ENABLE_INTF was successfully executed
...
2017-12-29 02:30:39.140 10484 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] Config generated for [00000000-0000-0000-0000-000000000003] SET_IP_ROUTE is:
<config>
        <cli-config-data>
            <cmd>ip route vrf nrouter-2e1bd8 10.0.0.0 255.0.0.0 192.168.70.254</cmd>
        </cli-config-data>
</config>
...
2017-12-29 02:30:39.255 10484 INFO networking_cisco.plugins.cisco.cfg_agent.device_drivers.csr1kv.iosxe_routing_driver [-] SET_IP_ROUTE was successfully executed
```

Interestingly enough, that route does *not* show up in VRF's routing table:

```
asr-01#sh ip route vrf nrouter-2e1bd8
...
Gateway of last resort is 192.168.70.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 192.168.70.1, GigabitEthernet0/0/0.70
      172.16.0.0/16 is variably subnetted, 2 subnets, 2 masks
C        172.16.0.0/24 is directly connected, GigabitEthernet0/0/2.794
L        172.16.0.1/32 is directly connected, GigabitEthernet0/0/2.794
```

The next hop address, `192.168.70.254`, is not *directly* reachable from the VRF and is not considered a valid next hop as written. The global routing table, on the other hand, contains an interface directly connected to that next hop address, and can be referenced as shown below. 

Instead of this:

```
ip route vrf nrouter-2e1bd8 10.0.0.0 255.0.0.0 192.168.70.254
```

The route entry would need to look like this:

```
ip route vrf nrouter-2e1bd8 10.0.0.0 255.0.0.0 GigabitEthernet0/0/0.70 192.168.70.254
```

Whether this is expected behavior on the part of the Cisco plugin is unknown, but it's certainly an unexpected behavior for someone coming from a standard L3 agent/network namespace architecture and worthy of a [bug report](https://bugs.launchpad.net/networking-cisco/+bug/1740452).

# Summary

Like the last post, I'd like to say this all worked perfectly the first time, but I'd be lying. When floating IPs are created, the asr1k snippet `SET_STATIC_SRC_TRL_NO_VRF_MATCH` implements a `redundancy` parameter that requires an HSRP group number that doesn't exist for standalone interfaces. I've since opened a bug [here](https://bugs.launchpad.net/networking-cisco/+bug/1739976) and patched my snippet and driver files accordingly. 

I hope to be able to follow up this series of walkthroughs with some benchmarks comparing a stock namespace-based implementation to one using a Cisco ASR. What I'm mainly interested in is "time to ping", meaning how long it takes for an instance to become reachable once a floating IP assignment has been made. When you're talking hundreds or thousands of floating IPs on a single router, things get interesting. 

If you've found this series interesting and would like to see more, feel free to hit me up on Twitter at @jimmdenton.
