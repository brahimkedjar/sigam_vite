import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  assignRoleToUser(userId: number | string, roleId: number | string) {
  return this.prisma.user.update({
    where: { id: Number(userId) },
    data: { roleId: Number(roleId) }
  });
}


  // user.service.ts
// user.service.ts
// user.service.ts
async getAllUsers() {
  return this.prisma.user.findMany({
    include: {
      role: {
        include: {
          rolePermissions: {
            include: {
              permission: true
            }
          }
        }
      },
      userGroups: {
        include: {
          group: {
            include: {
              groupPermissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      }
    }
  });
}

async assignGroupsToUser(userId: number, groupIds: number[]) {
  // First remove all existing group associations
  await this.prisma.userGroup.deleteMany({
    where: { userId }
  });

  // Then create new associations
  return this.prisma.userGroup.createMany({
    data: groupIds.map(groupId => ({
      userId,
      groupId
    }))
  });
}
}
