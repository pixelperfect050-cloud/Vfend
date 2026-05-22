import React from 'react'
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Heading,
  Button,
  Preview,
  Section,
} from '@react-email/components'

interface WelcomeEmailProps {
  email: string
}

export default function WelcomeEmail({ email }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your autonomous AI growth team is standing by.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Text style={logo}>BrandRocket</Text>
          </Section>
          
          <Section style={heroSection}>
            <Heading style={h1}>Welcome to the Future of Growth</Heading>
            <Text style={text}>
              You're officially on the waitlist for BrandRocket. 
            </Text>
            <Text style={text}>
              Very soon, you'll be able to describe your growth goals and watch an autonomous team of AI agents plan, build, and launch your campaigns while you sleep.
            </Text>
          </Section>

          <Section style={ctaSection}>
            <Button style={button} href="https://brandrocket.io">
              Access Demo Workspace
            </Button>
          </Section>

          <Section style={footerSection}>
            <Text style={footerText}>
              We are rolling out invites weekly. Keep an eye on your inbox.<br />
              — The BrandRocket Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#0a0a0a',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  width: '580px',
  backgroundColor: '#111111',
  borderRadius: '12px',
  border: '1px solid #222',
  marginTop: '40px',
  marginBottom: '40px',
}

const headerSection = {
  paddingBottom: '30px',
  borderBottom: '1px solid #222',
}

const logo = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#3b82f6', // brand blue
  margin: '0',
}

const heroSection = {
  paddingTop: '30px',
}

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  lineHeight: '1.2',
  marginBottom: '24px',
}

const text = {
  color: '#a1a1aa', // muted-foreground
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '24px',
}

const ctaSection = {
  textAlign: 'center' as const,
  marginTop: '32px',
  marginBottom: '32px',
}

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '14px 28px',
}

const footerSection = {
  borderTop: '1px solid #222',
  paddingTop: '30px',
}

const footerText = {
  fontSize: '14px',
  color: '#71717a',
  lineHeight: '22px',
}
