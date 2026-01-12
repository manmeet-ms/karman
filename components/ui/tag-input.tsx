"use client";

import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import { IconX } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TagInputProps {
  placeholder?: string;
  tags: string[];
  setTags: (tags: string[]) => void;
  colorClass: string; // e.g., "bg-blue-500/10 text-blue-600"
}

export function TagInput({ placeholder, tags, setTags, colorClass }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes(",")) {
      const split = value.split(",");
      // Add all parts except the last one (which remains in input)
      const newTags = split.slice(0, -1).map(s => s.trim()).filter(Boolean);
      setTags([...tags, ...newTags]);
      setInputValue(split[split.length - 1]);
    } else {
      setInputValue(value);
    }
  };

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      setTags([...tags, trimmed]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring">
      {tags.map((tag, index) => (
        <span
          key={index}
          className={cn(
            "flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold",
            colorClass
          )}
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="text-muted-foreground hover:text-foreground"
          >
            <IconX size={12} />
          </button>
        </span>
      ))}
      <input
        className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px]"
        placeholder={tags.length === 0 ? placeholder : ""}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
      />
    </div>
  );
}
