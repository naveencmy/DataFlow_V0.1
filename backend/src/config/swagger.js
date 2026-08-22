import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './env.js';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dayflow HRMS REST API',
      version: '1.0.0',
      description: 'Production-Grade Enterprise HR Management System API with strict N-Layer architecture and PostgreSQL backing',
      contact: {
        name: 'Dayflow Engineering Team',
        email: 'api@dayflow.internal',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            loginId: { type: 'string' },
            role: { type: 'string', enum: ['ADMIN', 'HR', 'EMPLOYEE'] },
            isEmailVerified: { type: 'boolean' },
          },
        },
        Employee: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            department: { type: 'string' },
            jobPosition: { type: 'string' },
            salary: { type: 'object' },
            bankDetails: { type: 'object' },
            skills: { type: 'array' },
          },
        },
        Attendance: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            employeeId: { type: 'string' },
            date: { type: 'string' },
            checkInTime: { type: 'string' },
            checkOutTime: { type: 'string' },
            workHours: { type: 'number' },
            extraHours: { type: 'number' },
            status: { type: 'string' },
          },
        },
        LeaveRequest: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            employeeId: { type: 'string' },
            leaveType: { type: 'string' },
            startDate: { type: 'string' },
            endDate: { type: 'string' },
            totalDays: { type: 'number' },
            status: { type: 'string', enum: ['Pending', 'Approved', 'Rejected'] },
          },
        },
        PayrollRun: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            employeeId: { type: 'string' },
            month: { type: 'string' },
            year: { type: 'integer' },
            payableDays: { type: 'number' },
            grossMonthlyWage: { type: 'number' },
            netPayableAmount: { type: 'number' },
            status: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/*.routes.js'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
export default swaggerSpec;
