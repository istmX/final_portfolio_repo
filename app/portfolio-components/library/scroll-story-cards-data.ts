import type { ScrollStoryCard } from '@/components/ui/scroll-story-cards'

export const SCROLL_STORY_CARDS: ScrollStoryCard[] = [
  {
    id: 'warmth',
    eyebrow: 'New York',
    title: 'A little more warmth',
    description:
      'Soft light settles across the frame while an open horizon leaves room for the story to unfold. The colors shift gently as this portrait approaches the center.',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSboVuRpK0mQvYcYWBXEcb6U0EeKFHEGfXQ1jljhOl8JQ&s=10',
    imageAlt: 'Portrait of a woman in warm natural light',
    color: '#e9e2f4',
    overlayColor: '#cbbce5',
    overlayOpacity: 0.2,
    buttonLabel: 'Explore',
    buttonHref: '/library/scroll-story-cards',
  },
  {
    id: 'stillness',
    eyebrow: 'San Francisco',
    title: 'A moment of stillness',
    description:
      'A quieter frame gives the details room to breathe. Small changes in light bring a different perspective into focus as the card rises.',
    image:
      'https://i.pinimg.com/1200x/64/74/37/647437e9b866d01d8e48a6f4bf5ab087.jpg',
    imageAlt: 'Portrait of a woman against a calm, muted backdrop',
    color: '#f2e5dc',
    overlayColor: '#e5c4ae',
    overlayOpacity: 0.2,
    buttonLabel: 'Discover',
    buttonHref: '/library/scroll-story-cards',
  },
  {
    id: 'greenhouse',
    eyebrow: 'Copenhagen',
    title: 'Somewhere in the green',
    description:
      'Color leads the way through a collection of small discoveries. The surrounding scene follows the portrait, blending into a soft green as it reaches the center.',
    image:
      'https://i.pinimg.com/1200x/cc/c9/89/ccc9897967477d537169a850720d6270.jpg',
    imageAlt: 'Portrait of a woman surrounded by soft green tones',
    color: '#e4eee2',
    overlayColor: '#bad2b3',
    overlayOpacity: 0.2,
    buttonLabel: 'View story',
    buttonHref: '/library/scroll-story-cards',
  },
  {
    id: 'afterglow',
    eyebrow: 'Late afternoon',
    title: 'The afterglow',
    description:
      'Late afternoon light softens the edges of the portrait. Its cooler palette carries the sequence into the next chapter without interrupting the scroll.',
    image:
      'https://i.pinimg.com/736x/cc/77/9f/cc779f84667c80dc494ae7a17e366926.jpg',
    imageAlt: 'Editorial portrait of a woman in late afternoon light',
    color: '#f3efcf',
    overlayColor: '#e1d58d',
    overlayOpacity: 0.2,
    buttonLabel: 'Explore',
    buttonHref: '/library/scroll-story-cards',
  },
  {
    id: 'violet-hour',
    eyebrow: 'Violet hour',
    title: 'Into the violet hour',
    description:
      'The final frame settles into a softer mix of violet and rose. Keep scrolling to see the last image leave the pinned scene and the page continue below.',
    image:
      'https://i.pinimg.com/736x/48/18/84/4818841f8ace05f1622e421953812547.jpg',
    imageAlt: 'Portrait of a woman with a warm, softly lit background',
    color: '#e2ecf3',
    overlayColor: '#b9d0df',
    overlayOpacity: 0.2,
    buttonLabel: 'Read story',
    buttonHref: '/library/scroll-story-cards',
  },
]
