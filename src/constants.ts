export interface MakeupStyle {
  id: string;
  name: string;
  description: string;
  prompt: string;
  image: string;
}

export const MAKEUP_STYLES: MakeupStyle[] = [
  {
    id: 'natural',
    name: 'ナチュラル',
    description: '素肌感を活かした自然な仕上がり',
    prompt: 'Apply a very natural, "no-makeup" makeup look. Enhance the skin with a dewy, translucent finish. Subtle mascara and a sheer nude lip tint. Keep the original facial features clearly recognizable but polished.',
    image: 'https://images.unsplash.com/photo-1514315384763-ba401779410f?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'business',
    name: 'ビジネス',
    description: '知的で清潔感のあるオフィス向け',
    prompt: 'Apply a professional business makeup look. Matte foundation, neutral eyeshadow in brown tones, defined but natural eyebrows, and a sophisticated rose or coral lipstick. The look should be clean, intelligent, and polished.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'elegant',
    name: 'エレガント',
    description: '上品で華やかなフォーマルスタイル',
    prompt: 'Apply an elegant and glamorous formal makeup look. Shimmering eyeshadow, winged eyeliner, well-defined lashes, and a classic bold red or deep berry lip. Add a subtle glow to the cheekbones for a sophisticated party look.',
    image: 'https://images.unsplash.com/photo-1513207565459-d7f36bfa1222?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'mode',
    name: 'モード',
    description: 'エッジの効いたトレンドスタイル',
    prompt: 'Apply a high-fashion mode makeup look. Sharp contouring, experimental eyeshadow colors or shapes (like graphic liner), and a unique lip color like deep plum or cool-toned beige. The look should be edgy and trend-setting.',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'jirai',
    name: '地雷系',
    description: '泣き腫らしたような赤い目元が特徴',
    prompt: 'Apply a "Jirai-kei" (landmine style) makeup look. Very pale, porcelain skin. Red or pink eyeshadow applied around the lower eyelids to create a "crying" effect. Dark, downturned eyeliner, prominent "aegyo-sal" (under-eye fat), and a gradient red lip.',
    image: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'korean',
    name: '韓国風',
    description: '水光肌、平行眉のK-Beauty',
    prompt: 'Apply a modern K-Beauty (Korean style) makeup look. Glass skin finish (high shine/dewy), straight horizontal eyebrows, coral or peach gradient lips, and subtle glitter on the eyelids. The look should be youthful and fresh.',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'gal',
    name: 'ギャル風',
    description: '派手な目元とシェーディング強調',
    prompt: 'Apply a modern "Gal" (Gyaru) makeup look. Heavy false lashes, thick eyeliner, strong nose contouring and bronzer, and a glossy nude or pale pink lip. The look should be bold, expressive, and glamorous.',
    image: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?auto=format&fit=crop&q=80&w=400',
  },
];
