/**
 * Cart page SSR route
 * Handles server-side rendering of the cart page
 */

import { Router, Request, Response } from 'express';
import React from 'react';
import { renderPage, render500 } from '../../utils/pageHelpers';
import CartPage from '../../../client/pages/CartPage';
import { AudioPlayerProvider } from '../../../client/context/AudioPlayerContext';

const router = Router();

/**
 * GET /cart
 * Render cart page with server-side rendering
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // Render page with SSR
    const pageComponent = React.createElement(CartPage);

    // Wrap with AudioPlayerProvider
    const component = React.createElement(
      AudioPlayerProvider,
      null,
      pageComponent
    );

    // Render the page
    renderPage(req, res, component, {
      title: 'Shopping Cart | Music Store',
      initialData: {},
      pageType: 'cart',
    });
  } catch (error) {
    console.error('Cart page error:', error);
    render500(req, res, error as Error);
  }
});

export default router;
