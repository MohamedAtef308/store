"use client";

import { useState } from "react";
import { Button } from "../ui/button";

type CommentProps = {
  comment: string;
};

function Comment({ comment }: CommentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <p className="text-sm">
        {comment.length > 130 && !isExpanded
          ? `${comment.slice(0, 130)}...`
          : comment}
      </p>
      {comment.length > 130 && (
        <Button
          className="pl-0 text-muted-foreground"
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
          variant="link"
        >
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      )}
    </div>
  );
}

export default Comment;
