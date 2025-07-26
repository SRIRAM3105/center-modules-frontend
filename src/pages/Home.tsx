
import React from 'react';
import { HeroSection } from '@/components/shared/HeroSection';
import { Section } from '@/components/shared/Section';
import { FeatureCard } from '@/components/shared/FeatureCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { UserPlus, BarChart2, Users, Sun, Zap, CreditCard } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection
        title="Harness the Power of Community Solar"
        subtitle="Join forces with your community to make solar energy more accessible, affordable, and impactful for everyone."
        primaryButtonText="Get Started"
        primaryButtonLink="/registration"
        secondaryButtonText="Learn More"
        secondaryButtonLink="#features"
        image="/lovable-uploads/469fe02e-dec9-4c4e-902e-dc07bc5445ef.png"
      />

      <Section id="features" className="bg-muted/30">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="section-title">One Platform, Complete Solar Journey</h2>
          <p className="section-subtitle">
            From joining a community to tracking your energy savings, our platform offers a seamless experience for community solar adoption.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="User Registration & Community"
            description="Sign up easily and join existing solar communities or create your own in your neighborhood."
            icon={UserPlus}
            className="animate-scale-in [animation-delay:100ms]"
          />
          <FeatureCard
            title="Data Collection & Plan Calculation"
            description="Input your energy usage data and get a customized solar plan that fits your needs and budget."
            icon={BarChart2}
            className="animate-scale-in [animation-delay:200ms]"
          />
          <FeatureCard
            title="Provider Matching & Installation"
            description="Get matched with certified installers, request quotes, and track the installation process."
            icon={Sun}
            className="animate-scale-in [animation-delay:300ms]"
          />
          <FeatureCard
            title="Community Decision Making"
            description="Participate in democratic decision-making processes to select providers and plans."
            icon={Users}
            className="animate-scale-in [animation-delay:400ms]"
          />
          <FeatureCard
            title="Payment & Cost-Sharing"
            description="Handle payments securely and distribute costs fairly among community members."
            icon={CreditCard}
            className="animate-scale-in [animation-delay:500ms]"
          />
          <FeatureCard
            title="Energy Monitoring & Support"
            description="Track energy production and consumption in real-time, and get support when needed."
            icon={Zap}
            className="animate-scale-in [animation-delay:600ms]"
          />
        </div>
      </Section>

      <Section>
        <div className="text-center max-w-4xl mx-auto mb-16 animate-slide-up">
          <h2 className="section-title">About SolarCommunity Platform</h2>
          <p className="section-subtitle mb-8">
            Transforming how communities adopt solar energy through collaboration and technology
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 items-start">
          <div className="space-y-6 animate-slide-in-right">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-solar-600">What We Do</h3>
              <p className="text-muted-foreground leading-relaxed">
                SolarCommunity is a comprehensive web platform that connects neighbors to create community solar energy projects. 
                We streamline the entire process from initial interest to installation and monitoring, making solar energy more 
                accessible and affordable through community collaboration.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4 text-eco-600">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To democratize solar energy by enabling communities to leverage collective buying power, share resources, 
                and make sustainable energy choices together. We believe that when neighbors work together, they can achieve 
                greater environmental impact while reducing individual costs.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4 text-solar-600">Why Community Solar?</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-solar-500 mt-2 flex-shrink-0"></div>
                  <span><strong>Lower Costs:</strong> Bulk purchasing power reduces installation costs for everyone</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-eco-500 mt-2 flex-shrink-0"></div>
                  <span><strong>Shared Resources:</strong> Pool knowledge, experiences, and maintenance responsibilities</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-solar-500 mt-2 flex-shrink-0"></div>
                  <span><strong>Greater Impact:</strong> Larger installations have bigger environmental benefits</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-eco-500 mt-2 flex-shrink-0"></div>
                  <span><strong>Community Building:</strong> Strengthen neighborhood bonds through shared sustainability goals</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 animate-slide-in-left">
            <div className="bg-gradient-to-br from-solar-50 to-eco-50 dark:from-solar-950/20 dark:to-eco-950/20 p-6 rounded-2xl border border-solar-200/50 dark:border-solar-800/50">
              <h3 className="text-xl font-semibold mb-4 text-solar-700 dark:text-solar-300">Platform Features</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Community Building</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• User registration & profiles</li>
                    <li>• Community creation & discovery</li>
                    <li>• Location-based matching</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Smart Analysis</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Solar potential assessment</li>
                    <li>• Energy consumption tracking</li>
                    <li>• Cost-benefit analysis</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Provider Network</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Certified installer directory</li>
                    <li>• Quote comparison system</li>
                    <li>• Community voting process</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Financial Tools</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Secure payment processing</li>
                    <li>• Fair cost distribution</li>
                    <li>• Real-time tracking</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-eco-50 to-solar-50 dark:from-eco-950/20 dark:to-solar-950/20 p-6 rounded-2xl border border-eco-200/50 dark:border-eco-800/50">
              <h3 className="text-xl font-semibold mb-3 text-eco-700 dark:text-eco-300">Built With Modern Technology</h3>
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "Tailwind CSS", "shadcn-ui", "React Query", "React Hook Form"].map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-white/80 dark:bg-gray-800/80 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-gradient-to-r from-solar-500/10 to-eco-500/10">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div className="animate-slide-in-right">
            <h2 className="section-title">How It Works</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-solar-500 flex items-center justify-center text-white font-semibold">1</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Register & Join</h3>
                  <p className="text-muted-foreground">Create an account and join an existing community or start your own.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-solar-500 flex items-center justify-center text-white font-semibold">2</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Share Your Data</h3>
                  <p className="text-muted-foreground">Input your energy consumption data to get a customized solar plan.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-solar-500 flex items-center justify-center text-white font-semibold">3</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Find Providers</h3>
                  <p className="text-muted-foreground">Get matched with certified solar installers and request quotes.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-solar-500 flex items-center justify-center text-white font-semibold">4</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Track & Save</h3>
                  <p className="text-muted-foreground">Monitor your energy production and savings in real-time.</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Link to="/registration">
                <Button className="button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600">
                  Start Your Solar Journey
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-elegant bg-white p-1 animate-slide-in-left">
            <img
              src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Solar panels on a residential roof"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      </Section>

      <Section className="bg-muted/20">
        <div className="text-center max-w-3xl mx-auto animate-slide-up">
          <h2 className="section-title">Ready to Join the Solar Revolution?</h2>
          <p className="section-subtitle">
            Take the first step towards sustainable energy and join a community of like-minded individuals committed to making a difference.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link to="/registration">
              <Button size="lg" className="button-animation bg-gradient-to-r from-solar-500 to-eco-500 hover:from-solar-600 hover:to-eco-600">
                Get Started Now
              </Button>
            </Link>
            <Link to="/data-collection">
              <Button variant="outline" size="lg" className="button-animation">
                Calculate Your Savings
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Home;
