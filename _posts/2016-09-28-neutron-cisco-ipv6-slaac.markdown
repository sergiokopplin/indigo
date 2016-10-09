---
title: "OpenStack Neutron IPv6 in a Large Nutshell"
layout: post
date: 2016-09-28
image: /assets/images/2016-09-26-neutron-trunks/tree-trunk.png
headerImage: true
tag:
blog: false
author: jamesdenton
description: Using IPv6 in Neutron with SLAAC and an external gateway device
---

I won't bore you with the details, but IPv6 has been a thorn in many systems administrators sides due to its perceived inconvenience and difficulty to master compared to IPv4. Here's the thing: IPv4 is no cake walk, either, and you can argue that folks don't know it as well as they think (yours truly included).

Since the Juno release of OpenStack, Neutron has had built-in support for IPv6 in some form or fashion. It hasn't been widely adopted, though, since it's real usefulness is dependent on some other features, like dynamic routing, that haven't merged until recent releases. 

## The major components we're working with

To provide IPv6 connectivity to instances we need:

- A router to send router advertisements, including the default route and (maybe) the IPv6 prefix, to instances
- A DHCP server to (maybe) send IP address information and other network information, such as DNS servers, to instances

To accomplish these tasks, Neutron provides three different methods for providing address configuration and other network information to instances:

- Stateless Address Auto-Configuration (SLAAC)
- DHCPv6-stateful
- DHCPv6-stateless

The online OpenStack [documentation](http://docs.openstack.org/mitaka/networking-guide/config-ipv6.html) outlines the differences in these methods pretty well, but to sum it up:

#### Stateless Address Auto-Configuration (SLAAC)
Address configuration is provided using a router advertisement (RA) sent by or solicited from an IPv6-capable router in the network.

#### DHCPv6-stateful
Address configuration and optional information using DHCPv6 only. REWORK THIS AND VERIFY

#### DHCPv6-stateless
Address configuration using RA and optional information using DHCPv6. REWORK THIS AND VERIFY

...

## Prerequisites

In this example, I'll be working with an OpenStack-Ansible-based deployment using OpenStack Newton and Open vSwitch. I'll also be ...

## Summary

In my limited experience so far, the VLAN trunking feature has worked flawlessly in my environment consisting of three infra nodes and a single compute node in a fairly-close-to-reference OpenStack-Ansible-based architecture. I have deviated, though, due to my use of Open vSwitch rather than LinuxBridge in this Newton-based installation. From what I can tell, both the Open vSwitch and LinuxBridge drivers will support the VLAN trunking feature. There will likely be bugs encountered along the way, but it's a feature that is much needed to meet today's requirements for networking in the cloud. 

If you have any questions about this feature, notice any issues with the writeup, or would like to learn more about some other feature in Neutron, please hit me up on Twitter!

