import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  async createGroup(name: string, description?: string) {
    return this.prisma.group.create({ 
      data: { name, description },
      include: {
        groupPermissions: true,
        userGroups: true
      }
    });
  }

   async assignUserToMultipleGroups(userId: number, groupIds: number[]) {
    await this.prisma.userGroup.deleteMany({
      where: { userId }
    });

    const data = groupIds.map(groupId => ({
      userId: Number(userId),
      groupId: Number(groupId),
    }));

    await this.prisma.userGroup.createMany({ data });
    
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        userGroups: {
          include: {
            group: true
          }
        }
      }
    });
  }

  async assignPermissionsToGroup(groupId: number, permissionIds: number[]) {
    await this.prisma.groupPermission.deleteMany({
      where: { groupId: Number(groupId) },
    });

    const data = permissionIds.map((permissionId) => ({
      groupId: Number(groupId),
      permissionId: Number(permissionId),
    }));

    await this.prisma.groupPermission.createMany({ data });
    
    return this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        groupPermissions: {
          include: {
            permission: true
          }
        },
        userGroups: {
          include: {
            user: true
          }
        }
      }
    });
  }

async deleteGroup(id: number) {
    const groupToDelete = await this.prisma.group.findUnique({
      where: { id },
      include: {
        groupPermissions: {
          include: {
            permission: true
          }
        },
        userGroups: {
          include: {
            user: true
          }
        }
      }
    });

    if (!groupToDelete) {
      throw new NotFoundException('Group not found');
    }

    await this.prisma.userGroup.deleteMany({
      where: { groupId: id },
    });

    await this.prisma.groupPermission.deleteMany({
      where: { groupId: id },
    });

    await this.prisma.group.delete({
      where: { id },
    });

    return groupToDelete;
  }

  async updateGroup(id: number, name: string, description?: string) {
    const currentGroup = await this.prisma.group.findUnique({
      where: { id },
      include: {
        groupPermissions: {
          include: {
            permission: true
          }
        },
        userGroups: {
          include: {
            user: true
          }
        }
      }
    });

    const updatedGroup = await this.prisma.group.update({
      where: { id },
      data: { name, description },
      include: {
        groupPermissions: {
          include: {
            permission: true
          }
        },
        userGroups: {
          include: {
            user: true
          }
        }
      }
    });

    return {
      ...updatedGroup,
      _old: currentGroup,
    };
  }

  getAllGroups() {
    return this.prisma.group.findMany({
      include: {
        groupPermissions: {
          include: {
            permission: true
          }
        },
        userGroups: {
          include: {
            user: true
          }
        }
      }
    });
  }

 async assignUserToGroup(userId: number, groupId: number) {
    await this.prisma.userGroup.create({
      data: {
        userId: Number(userId),
        groupId: Number(groupId)
      }
    });
    
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        userGroups: {
          include: {
            group: true
          }
        }
      }
    });
  }


  // Add this method if you need to remove a user from a group
  removeUserFromGroup(userId: number, groupId: number) {
    return this.prisma.userGroup.delete({
      where: {
        userId_groupId: {
          userId: Number(userId),
          groupId: Number(groupId)
        }
      }
    });
  }
}