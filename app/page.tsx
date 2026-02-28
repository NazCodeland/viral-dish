"use client";
// app/page.tsx

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import FoodCard from "@/components/FoodCard";
import VideoCardSkeleton from "@/components/VideoCardSkeleton";
import MenuButton from "@/components/MenuButton";
import AppMenu from "@/components/AppMenu";
import OnboardingModal from "@/components/OnboardingModal";
import Logo from "@/components/Logo";

export default function FeedPage() {
  const feed = useQuery(api.videos.getFeed, {});
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isLocationShared, setIsLocationShared] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  // Tracks whether the user is holding — hides logo + menu button
  const [isHolding, setIsHolding] = useState(false);

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
      {showOnboarding && (
        <OnboardingModal onDismiss={() => setShowOnboarding(false)} />
      )}

      <Logo hidden={isHolding} />
      <MenuButton
        visible={isMenuVisible && !isHolding}
        onClick={() => setMenuOpen(true)}
      />
      <AppMenu open={menuOpen} onOpenChange={setMenuOpen} />

      <div
        data-scroll-root
        className="h-dvh w-full snap-y snap-mandatory overflow-y-scroll bg-black [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {feed.map((video) => (
          <div key={video._id} className="w-full snap-start snap-always">
            <FoodCard
              dish={{
                id: video._id,
                title: video.title,
                dishDescription: video.dishDescription,
                videoSrc: video.videoKey,
                posterUrl: video.posterUrl ?? "",
                price: video.price,
                views: video.views,
                rating: video.rating,
                creator: {
                  handle: video.creator.handle,
                  avatarUrl: video.creator.avatarUrl,
                },
                restaurant: {
                  name: video.restaurantName,
                  arrivalMinutes: video.arrivalMinutes,
                },
                stats: {
                  likes: video.likesCount ?? 0,
                  saves: video.savesCount ?? 0,
                  comments: video.commentsCount ?? 0,
                },
              }}
              isLocationShared={isLocationShared}
              onLocationGranted={() => setIsLocationShared(true)}
              onComment={openComments}
              onCreator={viewCreator}
              onCustomize={openCustomize}
              onOverlayChange={setIsMenuVisible}
              onHoldChange={setIsHolding}
            />
          </div>
        ))}
      </div>
    </>
  );
}
