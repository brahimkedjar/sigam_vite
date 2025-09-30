import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

   async createRole(name: string) {
    return this.prisma.role.create({ 
      data: { name },
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        }
      }
    });
  }

  async assignPermissionsToRole(roleId: number, permissionIds: number[]) {
    await this.prisma.rolePermission.deleteMany({
      where: { roleId: Number(roleId) },
    });

    const data = permissionIds.map((permissionId) => ({
      roleId: Number(roleId),
      permissionId: Number(permissionId),
    }));

    await this.prisma.rolePermission.createMany({ data });
    
    return this.prisma.role.findUnique({
      where: { id: roleId },
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        }
      }
    });
  }

  async deleteRole(id: number) {
    const roleToDelete = await this.prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        }
      }
    });

    if (!roleToDelete) {
      throw new NotFoundException('Role not found');
    }

    await this.prisma.rolePermission.deleteMany({
      where: { roleId: id },
    });

    await this.prisma.user.updateMany({
      where: { roleId: id },
      data: { roleId: null },
    });

    await this.prisma.role.delete({
      where: { id },
    });

    return roleToDelete;
  }

  async updateRole(id: number, name: string) {
    const currentRole = await this.prisma.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        }
      }
    });

    const updatedRole = await this.prisma.role.update({
      where: { id },
      data: { name },
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        }
      }
    });

    return {
      ...updatedRole,
      _old: currentRole,
    };
  }

  getAllRoles() {
    return this.prisma.role.findMany({
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        }
      }
    });
  }

}
