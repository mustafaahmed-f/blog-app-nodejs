import { prisma } from "../../services/prismaClient.js";

export function handlePrismaError(error: any) {
  if (error instanceof prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return {
          status: 409,
          message: `Duplicate value for ${error.meta?.target}`,
        };
      case "P2003":
        return { status: 400, message: "Invalid foreign key reference" };
      case "P2025":
        return { status: 404, message: "Record not found" };
      case "P2014":
        return { status: 400, message: "Invalid relation reference" };
      case "P2000":
        return {
          status: 400,
          message: `Value too long for ${error.meta?.column_name}`,
        };
      default:
        return {
          status: 500,
          message: "Database error",
          details: error.message,
        };
    }
  }

  if (error instanceof prisma.PrismaClientValidationError) {
    return { status: 400, message: "Invalid input data" };
  }

  return { status: 500, message: "Unknown server error" };
}
