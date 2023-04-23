import { CommandInteractionOption } from 'discord.js'

export interface ExportCommand {
	options: CommandInteractionOption;
	execute(): void;
}