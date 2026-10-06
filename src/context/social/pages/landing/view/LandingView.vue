<template>
  <div id="top" class="sg-landing-page">
    <!-- Top Sticky Header -->
    <LandingNavbar />

    <!-- 1. Hero Section -->
    <LandingHero :stats="landingData.stats" />

    <!-- 2. Interactive Calculator / Simulator -->
    <LandingCalculator :materials="landingData.materialRates" />

    <!-- 3. Mandatory Territory / Company Selector Step -->
    <LandingTerritoryFinder
      :departments="landingData.departments"
      :companies="landingData.featuredCompanies"
    />

    <!-- 4. Rewards Catalogue Showcase -->
    <LandingRewardsCatalog />

    <!-- 5. Events & Enterprise Challenges -->
    <LandingEventsSection :events="landingData.upcomingEvents" />

    <!-- 6. The Social Network Experience -->
    <LandingSocialCommunity />

    <!-- 7. Real Colombian Testimonials -->
    <LandingTestimonials :testimonials="landingData.testimonials" />

    <!-- 8. Frequently Asked Questions -->
    <LandingFaq :faqs="landingData.faqs" />

    <!-- 9. Footer & Final CTA -->
    <LandingFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import landingData from '../services/landingData.json';

import LandingNavbar from '../components/LandingNavbar.vue';
import LandingHero from '../components/LandingHero.vue';
import LandingCalculator from '../components/LandingCalculator.vue';
import LandingTerritoryFinder from '../components/LandingTerritoryFinder.vue';
import LandingRewardsCatalog from '../components/LandingRewardsCatalog.vue';
import LandingEventsSection from '../components/LandingEventsSection.vue';
import LandingSocialCommunity from '../components/LandingSocialCommunity.vue';
import LandingTestimonials from '../components/LandingTestimonials.vue';
import LandingFaq from '../components/LandingFaq.vue';
import LandingFooter from '../components/LandingFooter.vue';

onMounted(() => {
  // Update document title for landing page
  document.title = 'Socialgea Colombia · Recicla, Acumula EcoPuntos y Canjea Premios';
});
</script>

<style src="../components/LandingView.css"></style>
