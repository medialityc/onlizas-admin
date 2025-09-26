import React from "react";
import Badge from "./badge/badge";
import { Button } from "./button/button";
import { XCircleIcon } from "lucide-react";

type Props = {
  selectedOptions: any[];
  removeSelected: (option: any) => void;
};
const CustomChipItem = ({ selectedOptions, removeSelected }: Props) => {
  return (
    <div className="flex flex-row gap-2 flex-wrap">
      {selectedOptions.map((option) => (
        <Badge
          className="dark:bg-slate-700   rounded-full   flex flex-row gap-2 p-1"
          key={option.id}
        >
          {option.name}
          <Button
            className="p-0 m-0 !bg-transparent border-0  "
            onClick={() => {
              removeSelected(option);
            }}
          >
            <XCircleIcon className="h-4 w-4" />
          </Button>
        </Badge>
      ))}
    </div>
  );
};

export default CustomChipItem;
