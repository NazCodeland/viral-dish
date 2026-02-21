"use client";
// app/page.tsx
// Equivalent of src/routes/+page.svelte
//
// Key differences from Svelte:
//   - useQuery from 'convex/react' instead of 'convex-svelte'
//   - feedQuery.isLoading / feedQuery.data pattern is identical
//   - Font loading moved to layout.tsx metadata (Next.js convention)
//   - Snap scroll container is identical Tailwind

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import FoodCard from "@/components/FoodCard";

export default function FeedPage() {
  // Direct equivalent of:  const feedQuery = useQuery(api.videos.getFeed, () => ({}));
  // In convex/react, useQuery takes args directly (no wrapper function needed)
  const feed = useQuery(api.videos.getFeed, {});

  // Placeholder handlers — replace with real drawer/sheet open calls
  // as we build out those components
  function openComments() {
    alert("Comments — coming soon");
  }

  function openMenu() {
    alert("Menu — Your Orders, Settings, Profile");
  }

  function viewCreator() {
    alert("View creator profile");
  }

  function openCustomize() {
    alert("Customization — coming soon");
  }

  return (
    // Snap scroll container — identical to Svelte version
    <div className="h-screen w-full snap-y snap-mandatory overflow-y-scroll bg-black">
      {/* Loading state — feed === undefined means Convex is still fetching */}
      {feed === undefined && (
        <div className="flex h-screen w-full items-center justify-center">
          <p className="animate-pulse font-semibold tracking-wide text-white/60">
            Loading feed...
          </p>
        </div>
      )}

      {/* Empty state */}
      {feed !== undefined && feed.length === 0 && (
        <div className="flex h-screen w-full items-center justify-center">
          <p className="text-white/60">No dishes found in your database.</p>
        </div>
      )}

      {/* Feed — each card is a full-screen snap section */}
      {feed?.map((video) => (
        <div key={video._id} className="h-screen w-full snap-start snap-always">
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
            onMenu={openMenu}
            onCreator={viewCreator}
            onCustomize={openCustomize}
          />
        </div>
      ))}
    </div>
  );
}
