import { verifyWebhook } from "@clerk/express/webhooks";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../services/prismaClient.js";
import { Webhook } from "svix";

const webhookSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET!;

console.log("Secret:", process.env.CLERK_WEBHOOK_SIGNING_SECRET);

export async function clerkWebhookHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const payload = req.body;
  const headers = {
    "svix-id": req.headers["svix-id"] as string,
    "svix-timestamp": req.headers["svix-timestamp"] as string,
    "svix-signature": req.headers["svix-signature"] as string,
  };

  if (
    !headers["svix-id"] ||
    !headers["svix-timestamp"] ||
    !headers["svix-signature"]
  ) {
    console.error("❌ Missing required Svix headers");
    return res.status(400).send("Missing Svix headers");
  }

  try {
    const wh = new Webhook(webhookSecret);
    const event = wh.verify(req.body.toString(), headers) as any;
    console.log("✅ Verified Clerk event:", event.type);

    switch (event.type) {
      case "user.created": {
        const { id, email_addresses, first_name, last_name, username } =
          event.data;
        let email_address = email_addresses[0].email_address;
        let result = await prisma.user.create({
          data: {
            email: email_address,
            firstName: first_name ?? "",
            lastName: last_name ?? "",
            userName: username ?? "",
            clerkId: id,
          },
        });
        if (!result) {
          throw new Error("Failed to add user !!");
        }
        res.status(200).json({ success: true });
        console.log("✅ User has been added to DB:", id);
        break;
      }
      case "user.updated": {
        const { id, email_addresses, first_name, last_name, username } =
          event.data;
        let email_address = email_addresses[0].email_address;
        let result = await prisma.user.update({
          where: {
            email: email_address,
          },
          data: {
            email: email_address,
            firstName: first_name ?? "",
            lastName: last_name ?? "",
            userName: username ?? "",
            clerkId: id,
          },
        });
        if (!result) {
          throw new Error("Failed to update user !!");
        }
        res.status(200).json({ success: true });
        console.log("✅ User has been updated :", id);
        break;
      }
      case "user.deleted": {
        const { id } = event.data;

        let result = await prisma.user.delete({
          where: {
            clerkId: id,
          },
        });
        if (!result) {
          throw new Error("Failed to delete user !!");
        }
        res.status(200).json({ success: true });
        console.log("✅ User has been deleted :", id);
        break;
      }
      default:
        throw new Error("Unknow eveny type !!");
    }
  } catch (error: any) {
    console.error("Webhook verification failed:", error);
    return res.status(400).send(`Webhook error : ${error.message}`);
  }
}
