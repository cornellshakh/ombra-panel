import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Paintbrush } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { useTranslation } from "react-i18next";

type ColorPickerProps = {
  color: string;
  setColor: (color: string) => void;
};

function ColorPicker({ color, setColor }: ColorPickerProps) {
  const { t } = useTranslation();

  // https://www.reddit.com/r/DiscordColorRoles/comments/mbtfcp/80_discord_color_roles_a_free_discord_template/#lightbox
  const solids = [
    "#B11612", // red
    "#42B246", // green
    "#0080FF", // azure
    "#02E7E7", // icy mint
    "#FDD708", // gold
    "#D17B2A", // orange
    "#7502F5", // electric indigo
    "#CBC6CA", // silver
  ];

  return (
    <div className="flex">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "text-left font-normal w-full",
              !color && "text-muted-foreground"
            )}
          >
            <div className="flex w-full items-center gap-2">
              {color ? (
                <div
                  className="h-4 w-4 rounded"
                  style={{ background: color }}
                ></div>
              ) : (
                <Paintbrush className="h-4 w-4" />
              )}
              <div className="flex-1 truncate">
                {color || t("form.placeholder.color_picker")}
              </div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full" align="start">
          <div className="flex flex-wrap gap-1">
            {solids.map((s) => (
              <div
                key={s}
                style={{ background: s }}
                className="h-6 w-6 cursor-pointer rounded-md active:scale-105"
                onClick={() => setColor(s)}
              />
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <HexColorPicker color={color} onChange={setColor} />
          </div>

          <Input
            id="custom"
            value={color}
            className="mt-4 h-8 w-full"
            onChange={(e) => setColor(e.currentTarget.value)}
            placeholder={t("form.placeholder.color_picker")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

ColorPicker.displayName = "ColorPicker";
export default ColorPicker;
