// app\types.ts
export interface Creator {
  handle: string;
  avatarUrl: string;
}

export interface Restaurant {
  name: string;
  distanceKm: number;
  arrivalTime: string;
  arrivalMinutes: number;
}

export interface SocialStats {
  likes: number;
  saves: number;
  comments: number;
}

export interface Dish {
  id: string;
  title: string;
  price: number;
  videoSrc?: string;
  posterUrl?: string;
  creator: Creator;
  restaurant: Restaurant;
  stats: SocialStats;
}
