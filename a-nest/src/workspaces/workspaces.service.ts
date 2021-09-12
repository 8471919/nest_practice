import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Channels } from 'src/entities/Channels';
import { Users } from 'src/entities/Users';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { Workspaces } from 'src/entities/Workspaces';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}
  //상속받아서 쓸 때, dependency injection이 안되는 문제를 해결하려면 이렇게 쓰자.
  //   @InjectRepository(Workspaces)
  //   private workspacesRepository: Repository<Workspaces>;
  //   @InjectRepository(Channels)
  //   private channelsRepository: Repository<Channels>;
  //   @InjectRepository(WorkspaceMembers)
  //   private workspaceMembersRepository: Repository<WorkspaceMembers>;
  //   @InjectRepository(ChannelMembers)
  //   private channelMembersRepository: Repository<ChannelMembers>;
  //   @InjectRepository(Users)
  //   private usersRepository: Repository<Users>;

  async findById(id: number) {
    return this.workspacesRepository.findByIds([id]);
  }

  async findMyWorkspaces(myId: number) {
    return this.workspacesRepository.find({
      where: {
        WorkspaceMembers: [{ UserId: myId }],
      },
    });
  }

  async createWorkspace(name: string, url: string, myId: number) {
    const workspace = this.workspacesRepository.create({
      name,
      url,
      OwnerId: myId,
    });
    const returned = await this.workspacesRepository.save(workspace);

    const workspaceMember = new WorkspaceMembers();
    workspaceMember.UserId = myId;
    workspaceMember.WorkspaceId = returned.id;
    const channel = new Channels();
    channel.name = '일반';
    channel.WorkspaceId = returned.id;
    const [, channelReturned] = await Promise.all([
      this.workspaceMembersRepository.save(workspaceMember),
      this.channelsRepository.save(channel),
    ]);
    const channelMember = new ChannelMembers();
    channelMember.UserId = myId;
    channelMember.ChannelId = channelReturned.id;
    await this.channelMembersRepository.save(channelMember);
  }

  async getWorkspaceMembers(url: string) {
    return this.usersRepository
      .createQueryBuilder('u')
      .innerJoin('u.WorkspaceMembers', 'm')
      .innerJoin('m.Workspace', 'w', 'w.url = :url', { url: url })
      .getMany(); //getRawMany() 와의 차이
    // ID, EMAIL, PASSWORD, Workspace.NAME, Workspace.URL   -> getRawMany()
    /*    {
        id: '',
        email: '',
        'Workspace.name': '',
      } */

    //getMany()
    /*{ 
        id: '',
        email: '',
        Workspace: {
          name: '',
        }
      } */
  }

  async createWorkspaceMembers(url, email) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
      // relations: ['Channels'],
      join: {
        alias: 'workspace',
        innerJoinAndSelect: {
          channels: 'workspace.Channels',
        },
      },
    });
    // this.workspaceRepository.createQueryBuilder('workspace').innerJoinAndSelect('workspace.Channels', 'channels').getOne();
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    const workspaceMember = new WorkspaceMembers();
    workspaceMember.WorkspaceId = workspace.id;
    workspaceMember.UserId = user.id;
    await this.workspaceMembersRepository.save(workspaceMember);
    const channelMember = new ChannelMembers();
    channelMember.ChannelId = workspace.Channels.find(
      (v) => v.name === '일반',
    ).id;
    channelMember.UserId = user.id;
    await this.channelMembersRepository.save(channelMember);
  }

  async getWorkspaceMember(url: string, id: number) {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .innerJoin('user.Workspaces', 'workspaces', 'workspaces.url = :url', {
        url,
      })
      .getOne();
  }
}
