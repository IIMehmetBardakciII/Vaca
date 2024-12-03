export async function createChatChannelForVisualClass(
  chatClient: any,
  channelId: string,
  userId: string
) {
  if (!chatClient || !channelId || !userId) {
    console.error(
      "Chat client, channel ID veya user ID eksik. Bu hata createChatChannelForVisualClass.ts'den geliyor"
    );
    return null;
  }

  try {
    const channel = chatClient.channel("messaging", channelId, {
      name: `Visual Class - ${channelId}`,
    });
    await channel.create();
    await channel.addMembers([userId]);

    return channel.id; // Kanalın id'sini döndür
  } catch (error) {
    console.error("Kanal oluşturulurken hata oluştu:", error);
    return null;
  }
}
