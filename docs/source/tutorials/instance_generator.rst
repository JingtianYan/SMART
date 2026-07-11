MAPF Problem Instance Generator Integration
+++++++++++++++++++++++++++++++++++++++++++++

.. figure:: ../readme_assets/l-smart-2.0.png
   :alt: LSMART Pipeline
   :align: left
   :width: 100%

The instance generator is responsible for generating the next MAPF problem instance by:

1. computing a commit cut on the ADG to determine the start states of the AGVs,
2. assigning goals to the AGVs,
3. refining the goals to satisfy planner-specific assumptions if necessary. 

To compute the commit cut, we use the same algorithm from `Hönig et al. 2019`_, which looks into the future for :math:`\frac{T}{\epsilon}` actions for each AGV, where :math:`T` is the planner time limit and :math:`\epsilon` is the minimal amount of time for an AGV to finish one action. Since LSMART focuses on evaluating MAPF algorithms, we use a random goal assigner.


Our Provided Instance Generators
=================================

We provide three instance generators, including:

- ``windowed``: the windowed task assigner (`Li et al. 2021`_), which assigns tasks within the planning window. This can only be used with the ``RHCR`` planner.
- ``distinct-one-goal``: the distinct one-goal task assigner, which assigns each robot a distinct goal. This can only be used with the ``PBS`` and ``MASS`` planners.
- ``one-goal``: the one-goal task assigner, which assigns each robot a goal regardless of duplicates. This can only be used with the ``TPBS`` planner.



Add New Instance Generators
============================

Implementing a new instance generator requires no RPC communication since it is handled within LSMART. The instance generator shall inherit the abstract class :ref:`exhale_class_classBasicTaskAssigner` and implement the pure virtual functions defined in the class. As an example, we refer the users to :ref:`exhale_class_classWindowedTaskAssigner` for the ``windowed`` instance generator.


.. doxygenclass:: BasicTaskAssigner
   :project: server
   :members:

.. _Hönig et al. 2019: https://ieeexplore.ieee.org/document/8620328
.. _Li et al. 2021: https://arxiv.org/abs/2005.07371
