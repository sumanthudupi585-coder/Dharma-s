import React from 'react';
import styled from 'styled-components';
import { devices, spacing, containers } from '../tokens';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';

const Shell = styled.div`
  /* MOBILE-FIRST: Single column layout */
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height for mobile */
  display: grid;

  /* Mobile: Simple stacked layout */
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header"
    "main"
    "footer";

  /* Tablet: Add sidebar space but keep simple */
  @media ${devices.tablet} {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      "header"
      "main"
      "footer";
  }

  /* Desktop: Two-column layout with sidebar */
  @media ${devices.desktop} {
    grid-template-columns: 280px 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas:
      "header header"
      "sidebar main"
      "footer footer";

    /* When sidebar is present */
    &.has-sidebar {
      grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
    }

    /* When no sidebar needed */
    &.no-sidebar {
      grid-template-columns: 1fr;
      grid-template-areas:
        "header"
        "main"
        "footer";
    }
  }

  /* Wide screens: Larger sidebar */
  @media ${devices.wide} {
    &.has-sidebar {
      grid-template-columns: 320px 1fr;
    }
  }
`;

const SkipLink = styled.a`
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;

  &:focus {
    left: ${spacing.lg};
    top: ${spacing.lg};
    width: auto;
    height: auto;
    z-index: 2000;
    background: linear-gradient(145deg, rgba(0,0,0,0.92), rgba(10,10,10,0.98));
    color: #e8c86a;
    border: 1px solid rgba(212,175,55,0.45);
    border-radius: 8px;
    padding: ${spacing['2']} ${spacing['3']};
    text-decoration: none;
    font-weight: 600;

    /* Ensure good touch target size */
    min-height: 44px;
    min-width: 44px;
    display: flex;
    align-items: center;
  }
`;

const Header = styled.header`
  grid-area: header;
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(145deg, rgba(0,0,0,0.9), rgba(10,10,10,0.98));
  border-bottom: 1px solid rgba(212,175,55,0.25);
  backdrop-filter: blur(8px);

  /* Ensure header doesn't get too tall on mobile */
  min-height: 60px;

  @media ${devices.tablet} {
    min-height: 70px;
  }
`;

const HeaderInner = styled.div`
  max-width: ${containers.xl};
  margin: 0 auto;
  padding: ${spacing.sm} ${spacing.md};
  display: grid;
  gap: ${spacing.md};
  align-items: center;

  /* Mobile: Stack or simple layout */
  grid-template-columns: 1fr auto;

  @media ${devices.tablet} {
    grid-template-columns: auto 1fr auto;
    padding: ${spacing.sm} ${spacing.lg};
  }

  @media ${devices.desktop} {
    padding: ${spacing.md} ${spacing.lg};
  }
`;

const Brand = styled.h1`
  margin: 0;
  font-family: var(--font-display);
  color: var(--gold);
  letter-spacing: 0.06em;

  /* Mobile-first sizing */
  font-size: var(--fs-md);

  @media ${devices.tablet} {
    font-size: var(--fs-lg);
  }

  @media ${devices.desktop} {
    font-size: var(--fs-xl);
  }

  /* Ensure it's tappable if it becomes a link */
  min-height: 44px;
  display: flex;
  align-items: center;
`;

const Nav = styled.nav`
  justify-self: end;
  display: flex;
  gap: ${spacing['2']};
  align-items: center;

  /* Mobile: Smaller gap */
  gap: ${spacing['1']};

  @media ${devices.tablet} {
    gap: ${spacing['2']};
  }

  @media ${devices.desktop} {
    gap: ${spacing['3']};
  }
`;

const Main = styled.main`
  grid-area: main;
  width: 100%;
  min-height: 0; /* Allows content to shrink */

  /* Mobile: Full width with padding */
  padding: 0;

  /* Contain layout to prevent overflow */
  overflow-x: hidden;

  /* Add scroll behavior for long content */
  overflow-y: auto;
`;

/* New Sidebar component for desktop layouts */
const Sidebar = styled.aside`
  grid-area: sidebar;
  background: linear-gradient(145deg, rgba(0,0,0,0.85), rgba(8,8,8,0.95));
  border-right: 1px solid rgba(212,175,55,0.25);
  overflow-y: auto;

  /* Hidden on mobile */
  display: none;

  @media ${devices.desktop} {
    display: block;
    padding: ${spacing.lg};
  }
`;

const Footer = styled.footer`
  grid-area: footer;
  background: linear-gradient(145deg, rgba(0,0,0,0.92), rgba(8,8,8,0.98));
  border-top: 1px solid rgba(212,175,55,0.2);

  /* Ensure footer is accessible but not too prominent on mobile */
  min-height: 50px;

  @media ${devices.tablet} {
    min-height: 60px;
  }
`;

const FooterInner = styled.div`
  max-width: ${containers.xl};
  margin: 0 auto;
  color: #b8941f;
  font-family: var(--font-primary);
  font-size: var(--fs-xs);
  display: flex;
  align-items: center;
  min-height: 44px; /* Ensure touch targets */

  /* Mobile: Stack vertically or reduce padding */
  padding: ${spacing.xs} ${spacing.sm};
  flex-direction: column;
  gap: ${spacing['1']};
  text-align: center;

  @media ${devices.tablet} {
    padding: ${spacing.sm} ${spacing.md};
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }

  @media ${devices.desktop} {
    padding: ${spacing.sm} ${spacing.lg};
  }
`;

export default function MasterLayout({
  brand = "Dharma's Cipher",
  rightSlot,
  children,
  footerSlot,
  sidebarContent,
  showHeader = true,
  showFooter = true
}) {
  const isTouch = useIsTouchDevice();
  const hasSidebar = sidebarContent && !isTouch;

  return (
    <Shell className={hasSidebar ? 'has-sidebar' : 'no-sidebar'}>
      <SkipLink href="#main-content">Skip to content</SkipLink>

      {showHeader && (
        <Header>
          <HeaderInner>
            <Brand>{brand}</Brand>
            {/* Only show spacer on tablet+ */}
            <div className="tablet-up" />
            <Nav aria-label="Primary">
              {rightSlot}
            </Nav>
          </HeaderInner>
        </Header>
      )}

      {hasSidebar && (
        <Sidebar aria-label="Navigation sidebar">
          {sidebarContent}
        </Sidebar>
      )}

      <Main id="main-content" role="main">
        {children}
      </Main>

      {showFooter && (
        <Footer>
          <FooterInner>
            <span>© {new Date().getFullYear()} Dharma's Cipher</span>
            {footerSlot && <span>{footerSlot}</span>}
          </FooterInner>
        </Footer>
      )}
    </Shell>
  );
}
