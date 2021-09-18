import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChannelsService } from './channels.service';
import { PostChatDto } from './dto/post-chat.dto';

@ApiTags('CHANNEL')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService);
  @Get()
  getAllChannels(@Param('url') url: string, @User() user) {
    return this.channelsService.getWorkspaceChannel(url, user.id);
  }

  @Post()
  createChannel() {}

  @Get(':name')
  getSpecificChannel(@Param('name') name: string) {}

  @Get(':name/chats')
  getChat(
    @Param('url') url: string,
    @Param('name') name: string,
    @Query() query,
    @Param() param,
  ) {
    console.log(query.perPage, query.page);
    console.log(param.id, param.url);
    return this.channelsService.getWorkspaceChannelChats(
      url,
      name,
      query.perPage,
      query.page,
    );
  }

  @Post(':name/chats')
  postChat(
    @Body() body: PostChatDto,
    @User() user,
    @Param('url') url: string,
    @Param('name') name: string,
  ) {
    return this.channelsService.postChat({
      url,
      content: body.content,
      name,
      myId: user.id,
    });
  }

  @Post(':name/images')
  postImages(@Body() body) {}

  @Get(':name/members')
  getAllMembers(@Param('url') url: string, @Param('name') name: string) {
    return this.channelsService.getWorkspaceChannelMembers(url, name);
  }

  @Post(':name/members')
  inviteMembers() {}
}
