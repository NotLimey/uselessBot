import { Command } from "./Command";
import { RemoveSuggestion } from "./commands/RemoveSuggestion";
import { Suggestion } from "./commands/Suggestion";
import { Suggestions } from "./commands/Suggestions";

export const Commands: Command[] = [Suggestion, Suggestions, RemoveSuggestion]; 