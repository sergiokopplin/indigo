---
layout: post
title:  "VLAN trunking support in Neutron"
desc: "VLANs, Trunks, Oh My!"
keywords: "networking,blog,neutron,openstack,vlan,802.1q"
date: 2016-09-25
categories: [Openstack]
tags: [blog]
icon: fa-bookmark-o
---

One of the features I've been looking forward to for the last few release cycles of OpenStack is *VLAN-aware VMs*, otherwise known as _VLAN trunking support_.

In a traditional network, a trunk is a type of interface that carries multiple VLANs, and is defined by the 802.1q standard. Trunks are often used to connect multiple switches together and allow for VLAN sprawl across the network.

With the advent of the hypervisor, trunks were a popular way for a server to host machines from multiple networks using a single interface. In an OpenStack cloud, most compute nodes have one or more interfaces that are configured as trunks and host virtual machines from many different networks. Up to now, this is where the use of trunks has ended. When virtual machines required connections to multiple networks, the solution was to multi-home them by assigning multiple interfaces, resulting in `eth0`, `eth1`, `eth2`, etc., inside the virtual machine and respective connections to the virtual switch(es) on the compute node.
##Prerequisites
In order to use the VLAN trunking feature within OpenStack, you must be running a version of OpenStack that supports the feature. At this time, the only release that supports it is not yet officially released: *OpenStack Newton*. Don't let that stop you, though, as the folks running the [OpenStack-Ansible](https://github.com/openstack/openstack-ansible) project have some great documentation [here](http://docs.openstack.org/developer/openstack-ansible/) to help get you started with an all-in-one or multi-node installation in no time.

Not only do you need a version of OpenStack that supports the feature, but also a mechanism driver that can implement it. This means using the Open vSwitch or LinuxBridge drivers. Other drivers may support it as well, but those won't be discussed here. In this post, I'll demonstrate an implementation using OVS, but later I hope to test LinuxBridge as well.

##Configuration changes

If you're not using OpenStack-Ansible to manage your environment, you'll want to make the following change to the `neutron.conf` file on the host running `neutron-server`:

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

That should implement the changes and restart the `neutron-server` process.

## Workflow

The following table demonstrates three different networks in my environment:

```
+--------------------------------------+--------------------+--------------+-----------------+------------------+
| id                                   | name               | network_type | segmentation_id | subnets          |
+--------------------------------------+--------------------+--------------+-----------------+------------------+
| 4e6af46f-d2a5-461e-b141-ff6f1f3c1a9f | MyPrivateNet       | vlan         |             157 | 172.20.0.0/26    |
| 530332f0-548b-4a82-b2a6-a7007f250933 | Network89          | vlan         |             190 | 192.168.89.0/24  |
| a8cf42a5-3cca-4354-a7aa-aa4e3634c47b | SomeOtherNet       | vlan         |             181 | 192.168.5.0/24   |
+--------------------------------------+--------------------+--------------+-----------------+------------------+
```

Creating a trunk for use by a virtual machine involves creating a single parent port and one or more subports, also known as _child ports_. All of the ports and respective networks will be available to the instance. Rather than being connected as separate interfaces, however, the instance will be able to tag traffic on a single interface.

### Create the parent port
The following `openstack` command can be used to create the parent port. The parent port will be the port you attach to the instance at boot, and will act as an untagged interface, mimicking existing functionality:

```
openstack port create --network Network89 parent0
```

