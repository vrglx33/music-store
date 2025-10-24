/**
 * Client entry point
 * Handles client-side React hydration
 */

import React from 'react';
import { hydrateRoot } from 'react-dom/client';

// Import page components
import CatalogPage from './pages/CatalogPage';
import AlbumDetailPage from './pages/AlbumDetailPage';
import SongDetailPage from './pages/SongDetailPage';
import { AudioPlayerProvider } from './context/AudioPlayerContext';

// Get initial data from server
const serverData = (window as any).__INITIAL_DATA__ || {};
const pageType = (window as any).__PAGE_TYPE__ || 'catalog';

// Hydrate the appropriate component based on page type
function hydratePage() {
  console.log('Starting hydration...', { pageType, serverData });

  const root = document.getElementById('root');

  if (!root) {
    console.error('Root element not found');
    return;
  }

  console.log('Root element found, has content:', root.innerHTML.length > 0);

  let pageComponent: React.ReactElement;

  try {
    switch (pageType) {
      case 'catalog':
        console.log('Hydrating CatalogPage with props:', serverData);
        pageComponent = <CatalogPage {...serverData} />;
        break;
      case 'album-detail':
        console.log('Hydrating AlbumDetailPage with props:', serverData);
        pageComponent = <AlbumDetailPage {...serverData} />;
        break;
      case 'song-detail':
        console.log('Hydrating SongDetailPage with props:', serverData);
        pageComponent = <SongDetailPage {...serverData} />;
        break;
      default:
        console.error(`Unknown page type: ${pageType}`);
        return;
    }

    // Wrap with AudioPlayerProvider
    const component = (
      <AudioPlayerProvider>{pageComponent}</AudioPlayerProvider>
    );

    // Hydrate the server-rendered content
    console.log('Calling hydrateRoot...');
    hydrateRoot(root, component);

    console.log(`Music Store client hydrated successfully (${pageType})`);

    // Force Tailwind CDN to process the hydrated content
    // This is needed because Tailwind CDN scans on page load, but hydration
    // happens after, so we need to trigger a rescan
    setTimeout(() => {
      if (typeof (window as any).__TAILWIND_JIT_PROCESS__ === 'function') {
        (window as any).__TAILWIND_JIT_PROCESS__();
      }
      // Force a repaint by hiding and showing the root
      root.style.display = 'none';
      root.offsetHeight; // Trigger reflow
      root.style.display = '';
    }, 0);
  } catch (error) {
    console.error('Hydration error:', error);
  }
}

// Run hydration when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydratePage);
  } else {
    hydratePage();
  }
}

export {};
