import styled from 'styled-components';
import { colors, spacing, radius, shadows, devices, containers } from '../tokens';

const Card = styled.div`
  /* MOBILE-FIRST: Optimized for small screens */
  border: 1px solid rgba(212,175,55,0.3);
  border-radius: ${radius.lg};
  background: linear-gradient(145deg, rgba(0,0,0,0.88), rgba(12,12,12,0.96));
  box-shadow: 0 8px 20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05);
  backdrop-filter: blur(8px);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  /* Mobile: Tighter padding, full width by default */
  padding: ${spacing.md};
  width: 100%;
  margin: 0;

  /* Prevent cards from being too wide */
  max-width: 100%;

  /* If card is interactive */
  ${props => props.interactive && `
    cursor: pointer;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;

    &:active {
      transform: scale(0.99);
    }
  `}

  /* Tablet: More generous padding */
  @media ${devices.tablet} {
    padding: ${spacing.lg};
    margin: ${spacing.sm};

    /* Allow cards to have reasonable max-width */
    max-width: ${containers.md};
  }

  /* Desktop: Enhanced styling and hover effects */
  @media ${devices.desktop} {
    padding: ${spacing.xl};
    margin: ${spacing.md};
    box-shadow: 0 10px 26px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05);

    /* Hover effects only on devices that support hover */
    @media ${devices.mouse} {
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 15px 35px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08);
      }

      ${props => props.interactive && `
        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1);
        }
      `}
    }
  }

  /* Wide screens: Larger max-width */
  @media ${devices.wide} {
    max-width: ${containers.lg};
  }

  /* Responsive content sizing */
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: ${spacing.sm};
  }

  p {
    margin-bottom: ${spacing.sm};

    &:last-child {
      margin-bottom: 0;
    }
  }

  /* Responsive images within cards */
  img {
    max-width: 100%;
    height: auto;
    border-radius: ${radius.md};
  }
`;

/* Card variants */
export const CardCompact = styled(Card)`
  /* Mobile: Very tight padding for compact layouts */
  padding: ${spacing.sm};

  @media ${devices.tablet} {
    padding: ${spacing.md};
  }

  @media ${devices.desktop} {
    padding: ${spacing.lg};
  }
`;

export const CardWide = styled(Card)`
  /* Mobile: Full width */
  width: 100%;

  @media ${devices.tablet} {
    max-width: none;
    width: 100%;
  }

  @media ${devices.desktop} {
    max-width: ${containers.xl};
  }
`;

export const CardGrid = styled.div`
  /* Mobile: Single column */
  display: grid;
  grid-template-columns: 1fr;
  gap: ${spacing.md};
  width: 100%;

  /* Tablet: Two columns */
  @media ${devices.tablet} {
    grid-template-columns: repeat(2, 1fr);
    gap: ${spacing.lg};
  }

  /* Desktop: Three columns for wider layouts */
  @media ${devices.desktop} {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: ${spacing.xl};
  }

  /* Wide screens: Four columns max */
  @media ${devices.wide} {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
`;

export default Card;
