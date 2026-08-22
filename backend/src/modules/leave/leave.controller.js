import { leaveService } from './leave.service.js';

export class LeaveController {
  constructor(service = leaveService) {
    this.service = service;
  }

  applyLeave = async (req, res, next) => {
    try {
      const leave = await this.service.applyLeave(req.user, req.body);
      res.status(201).json({
        success: true,
        message: 'Leave application submitted successfully',
        data: leave,
        leave,
      });
    } catch (error) {
      next(error);
    }
  };

  getMyLeaves = async (req, res, next) => {
    try {
      const leaves = await this.service.getMyLeaves(req.user);
      res.status(200).json({
        success: true,
        data: leaves,
        leaves,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllLeaves = async (req, res, next) => {
    try {
      const leaves = await this.service.getAllLeaves({
        status: req.query.status,
        employeeId: req.query.employeeId,
      });
      res.status(200).json({
        success: true,
        data: leaves,
        leaves,
      });
    } catch (error) {
      next(error);
    }
  };

  reviewLeave = async (req, res, next) => {
    try {
      const updated = await this.service.reviewLeave(req.params.id, req.body, req.user);
      res.status(200).json({
        success: true,
        message: `Leave request has been ${req.body.status.toLowerCase()}`,
        data: updated,
        leave: updated,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const leaveController = new LeaveController();
export default leaveController;
