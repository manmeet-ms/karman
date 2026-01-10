
import prisma from "@/lib/prisma";

export const UserService = {
  async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  async updateUser(id: string, data: any) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  },
};
