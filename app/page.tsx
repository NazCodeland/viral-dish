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

  // Shared across all cards — once the user grants location once, every card knows.
  const [isLocationShared, setIsLocationShared] = useState(false);

  // Onboarding modal — shown on every visit for now, localStorage tracking added later.
  const [showOnboarding, setShowOnboarding] = useState(true);

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
      <Logo visible={isMenuVisible} />
      <MenuButton visible={isMenuVisible} onClick={() => setMenuOpen(true)} />
      <AppMenu open={menuOpen} onOpenChange={setMenuOpen} />

      {/*
        data-scroll-root: semantic marker so FoodCard's IntersectionObserver
        can target this exact element as its root via closest("[data-scroll-root]").
        This makes the observer measure intersection ratios relative to this
        container's height rather than the visual viewport — fixing split-screen
        mode where the viewport can be smaller than the card.
      */}
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
            />
          </div>
        ))}
      </div>
    </>
  );
}
