"use client";
// components/CreatorAndSocialRail.tsx

import CreatorHeader from "./CreatorHeader";
import SocialRail from "./SocialRail";

interface Props {
  handle: string;
  avatarUrl: string;
  likes: number;
  saves: number;
  comments: number;
  onCreator?: () => void;
}

export default function CreatorAndSocialRail({
  handle,
  avatarUrl,
  likes,
  saves,
  comments,
  onCreator,
}: Props) {
  return (
    <div className="absolute right-3 bottom-44 z-20 flex flex-col items-center gap-5">
      <CreatorHeader
        handle={handle}
        avatarUrl={avatarUrl}
        onClick={onCreator}
      />
      <SocialRail likes={likes} saves={saves} comments={comments} />
    </div>
  );
}
