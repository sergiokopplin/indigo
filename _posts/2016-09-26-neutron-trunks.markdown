---
title: "VLAN trunking support in Neutron"
layout: post
date: 2016-09-26
image: /assets/images/2016-09-26-neutron-trunks/tree-trunk.png
headerImage: true
tag:
- networking
- blog
- neutron
- openstack
- trunks
- vlan
- tagging
- newton
blog: true
star: false
author: jamesdenton
description: VLAN trunking in Neutron (vlan-aware-vms)
---

One of the features I've been looking forward to for the last few release cycles of OpenStack and Neutron is *VLAN-aware VMs*, otherwise known as _VLAN trunking support_.

In a traditional network, a trunk is a type of interface that carries multiple VLANs, and is defined by the 802.1q standard. Trunks are often used to connect multiple switches together and allow for VLAN sprawl across the network.

<!--more-->
With the advent of the hypervisor, trunks were a popular way for a server to host machines from multiple networks using a single interface. In an OpenStack cloud, most compute nodes have one or more interfaces that are configured as trunks and host virtual machines on many different networks. When virtual machines required connections to multiple networks, the solution was to multi-home them by assigning multiple interfaces, resulting in `eth0`, `eth1`, `eth2`, etc., inside the virtual machine and respective connections to the virtual switch(es) on the compute node. This is problematic for certain types of virtual machines, as they may have a limited number of interfaces that can be attached to them. This is especially seen with VNFs like virtual firewalls, load balancers, etc. provided by popular third-party vendors.

## Prerequisites
In order to use the VLAN trunking feature within OpenStack, you must be running a version of OpenStack that supports the feature. At this time, the only release that supports it is not yet officially released: *OpenStack Newton*. Don't let that stop you, though, as the folks running the [OpenStack-Ansible](https://github.com/openstack/openstack-ansible) project have some great documentation [here](http://docs.openstack.org/developer/openstack-ansible/) to help get you started with an all-in-one or multi-node installation in no time.

Not only do you need a version of OpenStack that supports the feature, but also a mechanism driver that can implement it. This means using the Open vSwitch or LinuxBridge drivers. Other drivers may support it as well, but those won't be discussed here. In this post, I'll demonstrate an implementation using OVS, but later I hope to test LinuxBridge as well.

## Configuration changes

If you're not using OpenStack-Ansible to manage your environment, you'll want to add the `trunk` service plugin to the existing list of service plugins in the `neutron.conf` file on the host(s) running the Neutron API and restart the `neutron-server` service:

```
[neutron.conf]
service_plugin: trunk
```

Otherwise, edit the `/etc/openstack_deploy/user_variables.yml` file and add the word `trunk` to the following stanza:

```
neutron_plugin_base:
    - router
    - metering
    - neutron_dynamic_routing.services.bgp.bgp_plugin.BgpPlugin
    - trunk
```

You may need to create the stanza if it isn't already there, and will need to add the respective plugins for your environment. To implement the changes, navigate to the `/opt/openstack-ansible/playbooks` directory and execute the following:

```
openstack-ansible os-neutron-install.yml --tags neutron-config
```

That should implement the changes and restart the `neutron-server` service.

## Workflow

The following table demonstrates three different networks in my environment:

```
+--------------------------------------+-------------+--------------+-----------------+------------------+
| id                                   | name        | network_type | segmentation_id | subnets          |
+--------------------------------------+-------------+--------------+-----------------+------------------+
| 4e6af46f-d2a5-461e-b141-ff6f1f3c1a9f | NetworkA    | vlan         |             157 | 172.20.0.0/26    |
| 530332f0-548b-4a82-b2a6-a7007f250933 | NetworkB    | vlan         |             190 | 192.168.89.0/24  |
| a8cf42a5-3cca-4354-a7aa-aa4e3634c47b | NetworkC    | vlan         |             181 | 192.168.5.0/24   |
+--------------------------------------+-------------+--------------+-----------------+------------------+
```

Creating a trunk for use by a virtual machine involves creating a single parent port and one or more subports, also known as _child ports_. All of the ports and respective networks will be available to the instance. Rather than being connected as separate virtual interfaces, however, the instance will be able to tag traffic on a single interface.

The workflow involves the following steps:

- Creating a parent port
- Creating one or more child ports
- Creating a trunk
- Booting an instance
- Configuring the instance

### Create the parent port
The parent port will be the port you attach to the instance at boot, and will act as an untagged interface inside the instance, mimicking existing functionality. The following `openstack` command can be used to create the parent port:

```
Syntax:
openstack port create --network <network> <port>

Example:
openstack port create --network NetworkA parent0
```

```
# openstack port create --network NetworkA parent0
+-----------------------+----------------------------------------------------------------------------+
| Field                 | Value                                                                      |
+-----------------------+----------------------------------------------------------------------------+
| admin_state_up        | UP                                                                         |
| allowed_address_pairs |                                                                            |
| binding_host_id       |                                                                            |
| binding_profile       |                                                                            |
| binding_vif_details   |                                                                            |
| binding_vif_type      | unbound                                                                    |
| binding_vnic_type     | normal                                                                     |
| created_at            | 2016-09-26T14:19:18                                                        |
| description           |                                                                            |
| device_id             |                                                                            |
| device_owner          |                                                                            |
| extra_dhcp_opts       |                                                                            |
| fixed_ips             | ip_address='172.20.0.11', subnet_id='1f5e61ac-61ff-48f5-bc2e-e85a13fe664c' |
| headers               |                                                                            |
| id                    | ca9df52a-9dca-401d-8a65-4e56011dd9ca                                       |
| mac_address           | fa:16:3e:a2:a2:3d                                                          |
| name                  | parent0                                                                    |
| network_id            | 4e6af46f-d2a5-461e-b141-ff6f1f3c1a9f                                       |
| port_security_enabled | True                                                                       |
| project_id            | e559883d23ad43159c537d6d1bd1b1f0                                           |
| revision_number       | 4                                                                          |
| security_groups       | 84b68ead-9959-4495-8c8c-02b9bb9fd5fd                                       |
| status                | DOWN                                                                       |
| updated_at            | 2016-09-26T14:19:18                                                        |
+-----------------------+----------------------------------------------------------------------------+
```

### Create a child port
A child port is associated with the trunk, which in turn is associated with the parent port. Inside the instance, a subinterface will need to be created that tags traffic with the respective VLAN associated with the child port. The following `openstack` command can be used to create a child port:

```
Syntax:
openstack port create --network <network> <port>

Example:
openstack port create --network NetworkB child0-1
```

```
# openstack port create --network NetworkB child0-1
+-----------------------+---------------------------------------------------------------------------------------+
| Field                 | Value                                                                                 |
+-----------------------+---------------------------------------------------------------------------------------+
| admin_state_up        | UP                                                                                    |
| allowed_address_pairs |                                                                                       |
| binding_host_id       |                                                                                       |
| binding_profile       |                                                                                       |
| binding_vif_details   |                                                                                       |
| binding_vif_type      | unbound                                                                               |
| binding_vnic_type     | normal                                                                                |
| created_at            | 2016-09-26T14:24:01                                                                   |
| description           |                                                                                       |
| device_id             |                                                                                       |
| device_owner          |                                                                                       |
| extra_dhcp_opts       |                                                                                       |
| fixed_ips             | ip_address='192.168.89.11', subnet_id='c9ffb5c8-f9c1-4fa7-ae68-6997666784c1'          |
| headers               |                                                                                       |
| id                    | e6bdaf29-cc12-4ff0-ada8-734f95231c2a                                                  |
| mac_address           | fa:16:3e:91:af:d5                                                                     |
| name                  | child0-1                                                                              |
| network_id            | 530332f0-548b-4a82-b2a6-a7007f250933                                                  |
| port_security_enabled | True                                                                                  |
| project_id            | e559883d23ad43159c537d6d1bd1b1f0                                                      |
| revision_number       | 5                                                                                     |
| security_groups       | 84b68ead-9959-4495-8c8c-02b9bb9fd5fd                                                  |
| status                | DOWN                                                                                  |
| updated_at            | 2016-09-26T14:24:01                                                                   |
+-----------------------+---------------------------------------------------------------------------------------+
```

#### A couple of things to note...

When creating child ports, or any port for that matter, Neutron dynamically assigns a MAC address. However, when creating VLAN subinterfaces inside an instance, the subinterface may inherit the MAC address of the parent interface. This behavior is acceptable since the interfaces are on two different networks and MAC addresses don't pass the Layer-2 boundary. However, it may be problematic from a port security standpoint. When creating subinterfaces in an instance, you will need to specify the MAC address Neutron assigned for the child port or create the child port with the same MAC address of the parent port.

### Create the trunk

In Neutron, a VLAN trunk allows multiple networks to be connected to an instance using a single virtual NIC (vNIC). To create the trunk, use the `openstack network trunk create` command and specify a single parent port and one of more child ports:

```
Syntax:
openstack network trunk create --parent-port <parent port> --subport port=<child port>,segmentation-type=<network type>,segmentation-id=<seg id> <trunk name>

Example:
openstack network trunk create --parent-port parent0 --subport port=child0-1,segmentation-type=vlan,segmentation-id=190 trunk0
```
```
root@infra01-utility-container-6acef0d0:~# openstack network trunk create --parent-port parent0 --subport port=child0-1,segmentation-type=vlan,segmentation-id=190 trunk0
+-----------------+-------------------------------------------------------------------------------------------------+
| Field           | Value                                                                                           |
+-----------------+-------------------------------------------------------------------------------------------------+
| admin_state_up  | UP                                                                                              |
| created_at      | 2016-09-26T14:34:49Z                                                                            |
| description     |                                                                                                 |
| id              | 8ee80002-119e-4b35-af9a-eb37586591f5                                                            |
| name            | trunk0                                                                                          |
| port_id         | ca9df52a-9dca-401d-8a65-4e56011dd9ca                                                            |
| revision_number | 1                                                                                               |
| status          | DOWN                                                                                            |
| sub_ports       | port_id='e6bdaf29-cc12-4ff0-ada8-734f95231c2a', segmentation_id='190', segmentation_type='vlan' |
| tenant_id       | e559883d23ad43159c537d6d1bd1b1f0                                                                |
| updated_at      | 2016-09-26T14:34:49Z                                                                            |
+-----------------+-------------------------------------------------------------------------------------------------+
```

### Boot an instance

Now that the trunk has been created and associated with a parent port and child port(s), an instance can be booted and attached _only_ to the parent port. Since a VIF is not being created for the child interface(s), there's no need to attach them at boot. Logic within Neutron will associate traffic from child interfaces inside the instance with the parent interface. 

The following `openstack` command can be used to boot the instance:

```
Syntax:
openstack server create \
--flavor <flavor> \
--image <image> \
--nic port-id=<parent port id> \
--security-group <security group> \
--key-name <key name> \
<instance name>

Example:
openstack server create \
--flavor 2-2-20 \
--image "trusty-server" \
--nic port-id=ca9df52a-9dca-401d-8a65-4e56011dd9ca \
--security-group 84b68ead-9959-4495-8c8c-02b9bb9fd5fd \
--key-name james \
MyInstance
```

The `openstack server list` command can be used to validate the server is ACTIVE. At this time, only the IP address of the parent port attached to the instance at boot can be observed in the output:

```
# openstack server list
+--------------------------------------+------------+---------+-----------------------------------------------+---------------+
| ID                                   | Name       | Status  | Networks                                      | Image Name    |
+--------------------------------------+------------+---------+-----------------------------------------------+---------------+
| df35cffd-e569-4fbe-8d5a-858a782d4583 | MyInstance | ACTIVE  | NetworkA=172.20.0.11                          | trusty-server |
+--------------------------------------+------------+---------+-----------------------------------------------+---------------+
```

### Configuring the instance

The instance should be accessible at the IP address of the parent port. The interface is untagged within the instance, which mimics existing non-trunk behavior:

```
# ssh -i james.key ubuntu@172.20.0.11
The authenticity of host '172.20.0.11 (172.20.0.11)' can't be established.
ECDSA key fingerprint is 45:21:2f:1b:1c:84:27:96:33:04:d3:c3:9a:f8:eb:97.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '172.20.0.11' (ECDSA) to the list of known hosts.
Welcome to Ubuntu 14.04.5 LTS (GNU/Linux 3.13.0-93-generic x86_64)

ubuntu@myinstance:~$
```

By default, the instance will be configured with a single IP address on the main interface:

```
ubuntu@myinstance:~$ ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default
...
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether fa:16:3e:a2:a2:3d brd ff:ff:ff:ff:ff:ff
    inet 172.20.0.11/26 brd 172.20.0.63 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::f816:3eff:fea2:a23d/64 scope link
       valid_lft forever preferred_lft forever
```

From Neutron's perspective, the `eth0` interface will be treated as a trunk interface and will support VLAN tagging as long as the VLAN tag matches that of an associated child port. In a previous step, the child port associated with the trunk had the following attributes:

```
segmentation_id: 190
mac_address: fa:16:3e:91:af:d5
```

For convenience, a VLAN subinterface can be created with the `ip link` command. Or, the `/etc/network/interfaces` file (for Ubuntu) can be modified for persistent interface configuration.

Using the `ip link` command, create the VLAN subinterface and modify the MAC address:

```
# sudo ip link add link eth0 name eth0.190 type vlan id 190
# sudo ip link set dev eth0.190 address fa:16:3e:91:af:d5
# sudo ip link set eth0.190 up
```

The interface can be observed with the `ip addr` command:

```
ubuntu@myinstance:~$ ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default
...
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP group default qlen 1000
    link/ether fa:16:3e:a2:a2:3d brd ff:ff:ff:ff:ff:ff
    inet 172.20.0.11/26 brd 172.20.0.63 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::f816:3eff:fea2:a23d/64 scope link
       valid_lft forever preferred_lft forever
3: eth0.190@eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether fa:16:3e:91:af:d5 brd ff:ff:ff:ff:ff:ff
    inet6 fe80::f816:3eff:fe91:afd5/64 scope link
       valid_lft forever preferred_lft forever
```
The interface should be `UP` and have the specified MAC address.

### Verifying proper operation

The interface does not yet have an IP address, so connectivity cannot be confirmed just yet. There are two options here:

- DHCP
- Static address configuration

To utilize DHCP, simply run the `sudo dhclient eth0.190` command. If everything goes to plan, the Neutron DHCP server should return the assigned address and the interface will be configured:

```
ubuntu@myinstance:~$ ip addr show eth0.190
3: eth0.190@eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether fa:16:3e:91:af:d5 brd ff:ff:ff:ff:ff:ff
    inet 192.168.89.11/24 brd 192.168.89.255 scope global eth0.190
       valid_lft forever preferred_lft forever
    inet6 fe80::f816:3eff:fe91:afd5/64 scope link
       valid_lft forever preferred_lft forever
```

Otherwise, the interface can be configured using the `ip addr` command or within the respective network interface file.

A quick ping to a DHCP nameserver on another host demonstrates proper VLAN tagging taking place:

```
ubuntu@myinstance:~$ ping 192.168.89.4 -c1
PING 192.168.89.4 (192.168.89.4) 56(84) bytes of data.
64 bytes from 192.168.89.4: icmp_seq=1 ttl=64 time=0.808 ms

--- 192.168.89.4 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 0.808/0.808/0.808/0.000 ms
```

### Adding additional VLAN subinterfaces

To add another VLAN subinterface in the instance, a respective child port on the new network will need to be created and added to the trunk:

```
# openstack port create --network NetworkC child0-2
+-----------------------+----------------------------------------------------------------------------+
| Field                 | Value                                                                      |
+-----------------------+----------------------------------------------------------------------------+
| admin_state_up        | UP                                                                         |
| allowed_address_pairs |                                                                            |
| binding_host_id       |                                                                            |
| binding_profile       |                                                                            |
| binding_vif_details   |                                                                            |
| binding_vif_type      | unbound                                                                    |
| binding_vnic_type     | normal                                                                     |
| created_at            | 2016-09-26T15:13:01                                                        |
| description           |                                                                            |
| device_id             |                                                                            |
| device_owner          |                                                                            |
| extra_dhcp_opts       |                                                                            |
| fixed_ips             | ip_address='192.168.5.6', subnet_id='afd31b46-fb45-48db-99ca-3aaf7d780b07' |
| headers               |                                                                            |
| id                    | e1bcc22e-adb5-4ac6-90e9-326d0b297f10                                       |
| mac_address           | fa:16:3e:0c:64:9e                                                          |
| name                  | child0-2                                                                   |
| network_id            | a8cf42a5-3cca-4354-a7aa-aa4e3634c47b                                       |
| port_security_enabled | True                                                                       |
| project_id            | e559883d23ad43159c537d6d1bd1b1f0                                           |
| revision_number       | 4                                                                          |
| security_groups       | 84b68ead-9959-4495-8c8c-02b9bb9fd5fd                                       |
| status                | DOWN                                                                       |
| updated_at            | 2016-09-26T15:13:01                                                        |
+-----------------------+----------------------------------------------------------------------------+
```

The trunk can be modified using the `openstack network trunk set` command:

```
# openstack network trunk set --subport port=e1bcc22e-adb5-4ac6-90e9-326d0b297f10,segmentation-type=vlan,segmentation-id=181 trunk0
```

Within the instance, another VLAN subinterface can be created using the respective VLAN ID, MAC, and IP address:

```
# sudo ip link add link eth0 name eth0.181 type vlan id 181
# sudo ip link set dev eth0.181 address fa:16:3e:0c:64:9e
# sudo ip link set eth0.181 up
# sudo ip addr add 192.168.5.6/24 dev eth0.181
```

A quick ping to a DHCP nameserver on another host indicates proper VLAN tagging is taking place:

```
ubuntu@myinstance:~$ ping 192.168.5.4 -c1
PING 192.168.5.4 (192.168.5.4) 56(84) bytes of data.
64 bytes from 192.168.5.4: icmp_seq=1 ttl=64 time=0.434 ms

--- 192.168.5.4 ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 0.434/0.434/0.434/0.000 ms
```

### Summary

In my limited experience so far, the VLAN trunking feature has worked flawlessly in my environment consisting of three infra nodes and a single compute node in a fairly-close-to-reference OpenStack-Ansible-based architecture. I have deviated, though, due to my use of Open vSwitch rather than LinuxBridge in this Newton-based installation. From what I can tell, both the Open vSwitch and LinuxBridge drivers will support the VLAN trunking feature. There will likely be bugs encountered along the way, but it's a feature that is much needed to meet today's requirements for networking in the cloud. 

If you have any questions about this feature, notice any issues with the writeup, or would like to learn more about some other feature in Neutron, please hit me up on Twitter!

