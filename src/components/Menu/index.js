import React from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom';

const MenuColumn = styled.div`
  height: 100vh;
  padding: 0.5rem 0.5rem 0.5rem 0.75rem;
  position: sticky;
  top: 0px;
  z-index: 9999;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0) linear-gradient(193.68deg, #ba9dfb 0.68%, #e49dfb 100.48%) repeat scroll 0% 0%;
  color: #4d4065;
`;

const Title = styled.h1`
  font-weight: 700;
`

const Category = styled.div`
  display: grid;
  grid-auto-rows: auto;
  row-gap: 1.25rem;
  margin-bottom: 1.25rem;
`

const AboutSection = styled(Category)`
  box-sizing: border-box;
  img {
    margin-right: 0.75rem;
  }
`

const CategoryTitle = styled.h3`
  font-weight: 700;
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #4d4065;
  font-weight: 600;
  font-size: 16px;
  opacity: ${props => props.selected ? "1" : "0.6"};
  display: flex;
  img {
    margin-right: 0.75rem;
  }
  &:hover {
    opacity: 1
  }
`

export default function Menu() {
  const { pathname } = useLocation();

  return (
    <MenuColumn>
      <Title>DSTATS 1.0</Title>
      <AboutSection>
        <StyledLink to="/about" selected={ pathname === "/about" }><img alt="DSTATS" src="/favicon.ico" width="20" height="20"/>About</StyledLink>
      </AboutSection>
      <Category>
        <CategoryTitle>Tokens</CategoryTitle>
        <StyledLink to="/token/doki" selected={ pathname === "/token/doki" }><img alt="doki" src="/doki.png" width="20" height="20"/>Doki</StyledLink>
        <StyledLink to="/" selected={ pathname === "/" }><img alt="azuki" src="/azuki.png" width="20" height="20"/>Azuki</StyledLink>
      </Category>
      <Category>
        <CategoryTitle>Products</CategoryTitle>
        <StyledLink to="/product/degacha" selected={ pathname.search("/product/degacha") !== -1 }><img alt="degacha" src="/degacha.png" width="20" height="20"/>DeGacha</StyledLink>
      </Category>
    </MenuColumn>
  )
}
