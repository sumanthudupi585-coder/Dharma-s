import React from 'react';
import styled from 'styled-components';

const Shell = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(145deg, rgba(0,0,0,0.9), rgba(10,10,10,0.98));
  border-bottom: 1px solid rgba(212,175,55,0.25);
  backdrop-filter: blur(8px);
`;

const HeaderInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--spacing-md) var(--spacing-lg);
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--spacing-md);
  align-items: center;
`;

const Brand = styled.h1`
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--fs-lg);
  color: var(--gold);
  letter-spacing: 0.06em;
`;

const Nav = styled.nav`
  justify-self: end;
  display: flex;
  gap: 10px;
`;

const Main = styled.main`
  width: 100%;
`;

const Footer = styled.footer`
  background: linear-gradient(145deg, rgba(0,0,0,0.92), rgba(8,8,8,0.98));
  border-top: 1px solid rgba(212,175,55,0.2);
`;

const FooterInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--spacing-md) var(--spacing-lg);
  color: #b8941f;
  font-family: var(--font-primary);
  font-size: var(--fs-xs);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default function MasterLayout({ brand = "Dharma's Cipher", rightSlot, children, footerSlot }) {
  return (
    <Shell>
      <Header>
        <HeaderInner>
          <Brand>{brand}</Brand>
          <div />
          <Nav aria-label="Primary">
            {rightSlot}
          </Nav>
        </HeaderInner>
      </Header>
      <Main role="main">{children}</Main>
      <Footer>
        <FooterInner>
          <span>© {new Date().getFullYear()} Dharma's Cipher</span>
          <span>{footerSlot}</span>
        </FooterInner>
      </Footer>
    </Shell>
  );
}
