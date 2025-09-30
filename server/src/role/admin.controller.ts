import { Controller, Post, Body, Get, Delete, Param, Put, UseInterceptors, Req, NotFoundException } from '@nestjs/common';
import { RoleService } from './role.service';
import { PermissionService } from './permission.service';
import { UserService } from './user.service';
import { GroupService } from './group.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuditLog } from 'src/audit-log/decorators/audit-log.decorator';
import { Request } from 'express';

@Controller('admin')
export class AdminController {
  constructor(
    private roleService: RoleService,
    private permissionService: PermissionService,
    private userService: UserService,
    private groupService: GroupService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('role')
  @AuditLog({ entityType: 'Role' })
  async createRole(@Body() body: { name: string },@Req() request: Request) {
    const role = await this.roleService.createRole(body.name);
    return role;
  }

  @Post('permission')
  @AuditLog({ entityType: 'Permission' })
  async createPermission(@Body() body: { name: string },@Req() request: Request) {
    const permission = await this.permissionService.createPermission(body.name);
    return permission;
  }

  @Post('role/assign-permissions')
  @AuditLog({ entityType: 'Role' })
  async assignPermissions(@Body() body: { roleId: number, permissionIds: number[] },@Req() request: Request) {
    const result = await this.roleService.assignPermissionsToRole(body.roleId, body.permissionIds);
    return result;
  }

  @Post('user/assign-role')
  @AuditLog({ entityType: 'User' })
  async assignRoleToUser(@Body() body: { userId: number, roleId: number },@Req() request: Request) {
    const result = await this.userService.assignRoleToUser(Number(body.userId), Number(body.roleId));
    return result;
  }

  @Get('roles')
  @AuditLog({ entityType: 'Role', readAction: 'READ_ALL' })
  getRoles() {
    return this.roleService.getAllRoles();
  }

  @Get('permissions')
  @AuditLog({ entityType: 'Permission', readAction: 'READ_ALL' })
  getPermissions() {
    return this.permissionService.getAllPermissions();
  }

  @Get('users')
  @AuditLog({ entityType: 'User', readAction: 'READ_ALL' })
  getUsers() {
    return this.userService.getAllUsers();
  }

  @Delete('role/:id')
  @AuditLog({ entityType: 'Role' })
  async deleteRole(@Param('id') id: number,@Req() request: Request) {
    const roleToDelete = await this.prisma.role.findUnique({
      where: { id: Number(id) },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!roleToDelete) {
      throw new NotFoundException('Role not found');
    }

    await this.roleService.deleteRole(Number(id));
    return roleToDelete;
  }

  @Put('role/:id')
  @AuditLog({ entityType: 'Role' })
  async updateRole(@Param('id') id: number, @Body() body: { name: string },@Req() request: Request) {
    const oldRole = await this.prisma.role.findUnique({
      where: { id: Number(id) },
    });

    if (!oldRole) {
      throw new NotFoundException('Role not found');
    }

    const updatedRole = await this.roleService.updateRole(Number(id), body.name);
    return {
      ...updatedRole,
      _old: oldRole,
    };
  }

  @Delete('permission/:id')
  @AuditLog({ entityType: 'Permission' })
  async deletePermission(@Param('id') id: number,@Req() request: Request) {
    const permissionToDelete = await this.prisma.permission.findUnique({
      where: { id: Number(id) },
    });

    if (!permissionToDelete) {
      throw new NotFoundException('Permission not found');
    }

    await this.permissionService.deletePermission(Number(id));
    return permissionToDelete;
  }

  @Put('permission/:id')
  @AuditLog({ entityType: 'Permission' })
  async updatePermission(@Param('id') id: number, @Body() body: { name: string },@Req() request: Request) {
    const oldPermission = await this.prisma.permission.findUnique({
      where: { id: Number(id) },
    });

    if (!oldPermission) {
      throw new NotFoundException('Permission not found');
    }

    const updatedPermission = await this.permissionService.updatePermission(Number(id), body.name);
    return {
      ...updatedPermission,
      _old: oldPermission,
    };
  }

  @Post('group')
  @AuditLog({ entityType: 'Group' })
  async createGroup(@Body() body: { name: string, description?: string },@Req() request: Request) {
    const group = await this.groupService.createGroup(body.name, body.description);
    return group;
  }

  @Post('group/assign-permissions')
  @AuditLog({ entityType: 'Group' })
  async assignPermissionsToGroup(@Body() body: { groupId: number, permissionIds: number[] },@Req() request: Request) {
    const result = await this.groupService.assignPermissionsToGroup(body.groupId, body.permissionIds);
    return result;
  }

  @Post('user/assign-group')
  @AuditLog({ entityType: 'User' })
  async assignGroupToUser(@Body() body: { userId: number, groupId: number },@Req() request: Request) {
    const result = await this.groupService.assignUserToGroup(body.userId, body.groupId);
    return result;
  }

  @Get('groups')
  @AuditLog({ entityType: 'Group', readAction: 'READ_ALL' })
  getGroups() {
    return this.groupService.getAllGroups();
  }

  @Delete('group/:id')
  @AuditLog({ entityType: 'Group' })
  async deleteGroup(@Param('id') id: number,@Req() request: Request) {
    const groupToDelete = await this.prisma.group.findUnique({
      where: { id: Number(id) },
      include: {
        groupPermissions: true,
        userGroups: true,
      },
    });

    if (!groupToDelete) {
      throw new NotFoundException('Group not found');
    }

    await this.groupService.deleteGroup(Number(id));
    return groupToDelete;
  }

  @Put('group/:id')
  @AuditLog({ entityType: 'Group' })
  async updateGroup(@Param('id') id: number, @Body() body: { name: string, description?: string },@Req() request: Request) {
    const oldGroup = await this.prisma.group.findUnique({
      where: { id: Number(id) },
    });

    if (!oldGroup) {
      throw new NotFoundException('Group not found');
    }

    const updatedGroup = await this.groupService.updateGroup(Number(id), body.name, body.description);
    return {
      ...updatedGroup,
      _old: oldGroup,
    };
  }

  @Post('user/assign-groups')
  @AuditLog({ entityType: 'User' })
  async assignGroupsToUser(@Body() body: { userId: number, groupIds: number[] },@Req() request: Request) {
    const result = await this.groupService.assignUserToMultipleGroups(body.userId, body.groupIds);
    return result;
  }
}