Planner Invocation Policy Integration
++++++++++++++++++++++++++++++++++++++

.. figure:: ../readme_assets/l-smart-2.0.png
   :alt: LSMART Pipeline
   :align: left
   :width: 100%



Our Provided Invocation Policies
=================================

LSMART supports two planner invocation policies, including:

- **Periodic Policy**: The planner is invoked periodically every :math:`P`` seconds.
- **Event-based Policy** (`Hönig et al. 2019`_): The planner is invoked when at least one AGV is expected to finish executing all its actions in the ADG before the planner returns the next time. To determine whether an AGV is finishing its actions, we pre-define a time limit of :math:`T` seconds for the planner and compute the minimal amount of time for an AGV to finish one action as :math:`\epsilon` seconds based on the kinodynamic model of the AGV. If an AGV has fewer than :math:`\frac{T}{\epsilon}` actions left in the ADG, which is the maximum number of actions the AGV can finish in :math:`T` seconds, the event-based policy invokes the planner.


Add New Invocation Policies
============================

We do not support adding new invocation policies at the moment. We will add this feature in future releases.


.. _Hönig et al. 2019: https://ieeexplore.ieee.org/document/8620328
