"use client";
// app/page.tsx

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import FoodCard from "@/components/FoodCard";
import VideoCardSkeleton from "@/components/VideoCardSkeleton";
import MenuButton from "@/components/MenuButton";
import AppMenu from "@/components/AppMenu";

export default function FeedPage() {
  const feed = useQuery(api.videos.getFeed, {});
  const [menuOpen, setMenuOpen] = useState(false);

  // New state to sync the global menu button with the local food cards
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  function openComments() {
    alert("Comments — coming soon");
  }
  function viewCreator() {
    alert("View creator profile");
  }
  function openCustomize() {
    alert("Customization — coming soon");
  }

  if (feed === undefined || feed.length === 0) {
    return <VideoCardSkeleton />;
  }

  return (
    <>
      {/* Pass the visibility state to the global menu button */}
      <MenuButton visible={isMenuVisible} onClick={() => setMenuOpen(true)} />
      <AppMenu open={menuOpen} onOpenChange={setMenuOpen} />

      <div className="h-screen w-full snap-y snap-mandatory overflow-y-scroll bg-black">
        {feed.map((video) => (
          <div
            key={video._id}
            className="h-screen w-full snap-start snap-always"
          >
            <FoodCard
              dish={{
                id: video._id,
                title: video.title,
                videoSrc: video.videoKey,
                posterUrl: video.posterUrl ?? "",
                price: video.price,
                creator: {
                  handle: video.creator.handle,
                  avatarUrl: video.creator.avatarUrl,
                },
                restaurant: {
                  name: video.restaurantName,
                  distanceKm: video.distanceKm,
                  arrivalTime: video.arrivalTime,
                  arrivalMinutes: video.arrivalMinutes,
                },
                stats: {
                  likes: video.likesCount ?? 0,
                  saves: video.savesCount ?? 0,
                  comments: video.commentsCount ?? 0,
                },
              }}
              onComment={openComments}
              onCreator={viewCreator}
              onCustomize={openCustomize}
              // Pass the callback to let the card control the global menu button
              onOverlayChange={setIsMenuVisible}
            />
          </div>
        ))}
      </div>
    </>
  );
}
