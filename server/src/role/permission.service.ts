import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

   async createPermission(name: string) {
    return this.prisma.permission.create({ 
      data: { name },
      include: {
        rolePermissions: true,
        groupPermissions: true
      }
    });
  }

  async deletePermission(id: number) {
    const permissionToDelete = await this.prisma.permission.findUnique({
      where: { id },
      include: {
        rolePermissions: true,
        groupPermissions: true
      }
    });

    if (!permissionToDelete) {
      throw new NotFoundException('Permission not found');
    }

    await this.prisma.permission.delete({
      where: { id },
    });

    return permissionToDelete;
  }

  async updatePermission(id: number, name: string) {
    const currentPermission = await this.prisma.permission.findUnique({
      where: { id },
      include: {
        rolePermissions: true,
        groupPermissions: true
      }
    });

    const updatedPermission = await this.prisma.permission.update({
      where: { id },
      data: { name },
      include: {
        rolePermissions: true,
        groupPermissions: true
      }
    });

    return {
      ...updatedPermission,
      _old: currentPermission,
    };
  }

  getAllPermissions() {
    return this.prisma.permission.findMany({
      include: {
        rolePermissions: true,
        groupPermissions: true
      }
    });
  }


}
