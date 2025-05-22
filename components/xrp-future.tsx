"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import {
  TrendingUp,
  Globe,
  Zap,
  Scale,
  ArrowUpRight,
  Clock,
  Check,
  ExternalLink,
  BarChart2,
  PiggyBank,
  Building2,
  Landmark,
  Lightbulb,
  DollarSign,
  Shield,
} from "lucide-react"

export function XRPFuture() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Card className="xrp-gradient overflow-hidden special-card">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
          <div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-100 flex items-center glow-text">
              <img src="/placeholder.svg?height=40&width=40" alt="XRP Logo" className="mr-3 h-8 w-8 sm:h-10 sm:w-10" />
              XRP Future Outlook
            </CardTitle>
            <CardDescription className="text-gray-300 mt-2 text-base">
              Exploring XRP's potential impact on the future of cross-border payments and beyond
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <Badge className="bg-blue-600/70 hover:bg-blue-600/90 text-white">Cross-Border Payments</Badge>
            <Badge className="bg-indigo-600/70 hover:bg-indigo-600/90 text-white">RippleNet</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="mb-6">
          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 bg-slate-850/70 mb-6">
              <TabsTrigger value="overview" className="text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="use-cases" className="text-sm">
                Use Cases
              </TabsTrigger>
              <TabsTrigger value="regulatory" className="text-sm">
                Regulatory
              </TabsTrigger>
              <TabsTrigger value="timeline" className="text-sm">
                Future Timeline
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-5">
              <div className="bg-slate-800/40 p-5 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  XRP at a Glance
                </h3>
                <p className="text-gray-200 leading-relaxed mb-4">
                  XRP is the native digital asset on the XRP Ledger—an open-source, permissionless and decentralized
                  blockchain technology. XRP serves as a bridge currency in Ripple's payment network, facilitating fast
                  and cost-efficient cross-border transactions for financial institutions worldwide.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="feature-card p-4">
                    <div className="feature-icon mb-3">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">Ultra-Fast</h4>
                    <p className="text-gray-300 text-sm">
                      XRP transactions settle in 3-5 seconds, dramatically faster than traditional systems.
                    </p>
                  </div>

                  <div className="feature-card p-4">
                    <div className="feature-icon mb-3">
                      <PiggyBank className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">Cost Efficient</h4>
                    <p className="text-gray-300 text-sm">
                      Transactions cost just a fraction of a cent, saving institutions billions in fees.
                    </p>
                  </div>

                  <div className="feature-card p-4">
                    <div className="feature-icon mb-3">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">Scalable</h4>
                    <p className="text-gray-300 text-sm">
                      Handles 1,500 transactions per second with potential to scale to Visa levels.
                    </p>
                  </div>
                </div>

                <Alert className="bg-blue-900/20 border-blue-800/30 mt-6">
                  <Lightbulb className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-200">
                    Unlike many cryptocurrencies, XRP was specifically designed to enhance the efficiency of
                    international payment systems rather than replace traditional currencies.
                  </AlertDescription>
                </Alert>
              </div>

              <div className="bg-slate-800/40 p-5 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Future Growth Potential
                </h3>
                <p className="text-gray-200 leading-relaxed mb-4">
                  As global trade expands and digital payments accelerate, XRP is positioned to play a crucial role in
                  the future financial ecosystem. Its adoption by financial institutions continues to grow, with
                  potential to revolutionize the $2 trillion cross-border payment market.
                </p>

                <div className="mt-4 p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="font-semibold text-blue-300 mb-3">Key Growth Indicators</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">$2T+</div>
                      <div className="text-xs text-gray-400">Market Size</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">40%</div>
                      <div className="text-xs text-gray-400">Cost Reduction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">300+</div>
                      <div className="text-xs text-gray-400">Financial Partners</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">55+</div>
                      <div className="text-xs text-gray-400">Countries</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="use-cases" className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-slate-800/40 p-5 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    Financial Institutions
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-white">Cross-Border Payments</span>
                        <p className="text-gray-300 text-sm">
                          Replace nostro/vostro accounts with on-demand liquidity, freeing up capital and reducing
                          costs.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-white">Remittance Services</span>
                        <p className="text-gray-300 text-sm">
                          Enable instant, low-cost remittances to improve service for migrant workers sending money
                          home.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-white">Treasury Management</span>
                        <p className="text-gray-300 text-sm">
                          Optimize internal treasury operations between subsidiaries and across borders.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-800/40 p-5 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                    <Landmark className="h-5 w-5 mr-2" />
                    Central Banks & Governments
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-white">CBDC Infrastructure</span>
                        <p className="text-gray-300 text-sm">
                          Provide underlying technology for Central Bank Digital Currencies with the private XRP Ledger.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-white">Interoperability</span>
                        <p className="text-gray-300 text-sm">
                          Enable different CBDCs to interact seamlessly across borders using XRP as a bridge currency.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-white">Financial Inclusion</span>
                        <p className="text-gray-300 text-sm">
                          Bring banking services to the 1.7 billion unbanked individuals worldwide.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-800/40 p-5 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Emerging Markets
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-white">Currency Corridors</span>
                        <p className="text-gray-300 text-sm">
                          Establish liquidity in thin currency markets where traditional banking is expensive.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-white">SME Payments</span>
                        <p className="text-gray-300 text-sm">
                          Enable small and medium enterprises to participate in global trade with affordable payments.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-white">Economic Development</span>
                        <p className="text-gray-300 text-sm">
                          Reduce friction in international trade to stimulate economic growth.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-800/40 p-5 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                    <BarChart2 className="h-5 w-5 mr-2" />
                    Future Growth Areas
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-white">NFTs & Tokenization</span>
                        <p className="text-gray-300 text-sm">
                          The XRP Ledger now supports NFTs, opening new use cases in digital ownership and asset
                          tokenization.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-white">Smart Contracts</span>
                        <p className="text-gray-300 text-sm">
                          Sidechains to the XRP Ledger will enable smart contract functionality while maintaining the
                          core ledger's efficiency.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-white">DeFi Applications</span>
                        <p className="text-gray-300 text-sm">
                          Decentralized finance applications built on the XRP Ledger ecosystem could expand utility.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="regulatory" className="space-y-5">
              <div className="bg-slate-800/40 p-5 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                  <Scale className="h-5 w-5 mr-2" />
                  Regulatory Landscape
                </h3>
                <p className="text-gray-200 leading-relaxed mb-4">
                  The regulatory status of XRP has been a significant factor in its market performance. As regulatory
                  clarity increases globally, XRP's utility and adoption could see substantial growth.
                </p>

                <div className="p-4 bg-slate-700/30 rounded-lg mb-4">
                  <h4 className="font-semibold text-blue-300 mb-3">SEC Case Resolution</h4>
                  <p className="text-gray-300 text-sm mb-2">
                    The resolution of the SEC vs. Ripple case represents a potential turning point for XRP. Favorable
                    rulings could significantly reduce regulatory uncertainty and potentially lead to:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start">
                      <ArrowUpRight className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      Relisting on major U.S. exchanges that previously delisted XRP
                    </li>
                    <li className="flex items-start">
                      <ArrowUpRight className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      Increased institutional adoption as legal risks diminish
                    </li>
                    <li className="flex items-start">
                      <ArrowUpRight className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      Acceleration of banking partnerships and implementations
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="font-semibold text-blue-300 mb-3">Global Regulatory Framework</h4>
                  <p className="text-gray-300 text-sm mb-2">
                    Countries are developing clearer crypto regulations, with many markets already providing frameworks
                    that allow XRP to operate:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                    <div className="bg-slate-800/50 p-2 rounded">
                      <div className="text-xs text-gray-400">Japan</div>
                      <div className="text-sm font-medium text-green-400">Clear Framework</div>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded">
                      <div className="text-xs text-gray-400">Singapore</div>
                      <div className="text-sm font-medium text-green-400">Supportive</div>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded">
                      <div className="text-xs text-gray-400">UAE</div>
                      <div className="text-sm font-medium text-green-400">Embracing</div>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded">
                      <div className="text-xs text-gray-400">UK</div>
                      <div className="text-sm font-medium text-yellow-400">Developing</div>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded">
                      <div className="text-xs text-gray-400">EU</div>
                      <div className="text-sm font-medium text-yellow-400">MiCA Framework</div>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded">
                      <div className="text-xs text-gray-400">US</div>
                      <div className="text-sm font-medium text-yellow-400">Evolving</div>
                    </div>
                  </div>
                </div>

                <Alert className="bg-blue-900/20 border-blue-800/30 mt-4">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-200">
                    As regulatory clarity emerges globally, XRP's unique position as a bridge currency for regulated
                    financial institutions could give it significant advantages in the compliant crypto space.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-5">
              <div className="bg-slate-800/40 p-5 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  XRP Future Timeline
                </h3>
                <p className="text-gray-200 leading-relaxed mb-6">
                  The potential future trajectory of XRP and RippleNet, based on current developments and industry
                  trends:
                </p>

                <div className="timeline-container">
                  <div className="timeline-item">
                    <h4 className="text-white font-medium">Near Term (2023-2024)</h4>
                    <ul className="mt-2 space-y-2 text-gray-300">
                      <li className="text-sm">Resolution of major regulatory challenges, particularly the SEC case</li>
                      <li className="text-sm">Expansion of On-Demand Liquidity (ODL) corridors to more regions</li>
                      <li className="text-sm">
                        Increased adoption by payment providers and smaller financial institutions
                      </li>
                      <li className="text-sm">
                        Further development of NFT and tokenization capabilities on the XRP Ledger
                      </li>
                    </ul>
                  </div>

                  <div className="timeline-item">
                    <h4 className="text-white font-medium">Mid Term (2025-2027)</h4>
                    <ul className="mt-2 space-y-2 text-gray-300">
                      <li className="text-sm">Integration with multiple CBDC initiatives worldwide</li>
                      <li className="text-sm">Broader adoption by tier-1 banks for cross-border settlements</li>
                      <li className="text-sm">Full implementation of sidechains with smart contract functionality</li>
                      <li className="text-sm">Development of a robust DeFi ecosystem on the XRP Ledger</li>
                      <li className="text-sm">
                        Expanded interoperability between blockchains with XRP as a bridge asset
                      </li>
                    </ul>
                  </div>

                  <div className="timeline-item">
                    <h4 className="text-white font-medium">Long Term (2028 and beyond)</h4>
                    <ul className="mt-2 space-y-2 text-gray-300">
                      <li className="text-sm">Potential integration into standard banking infrastructure worldwide</li>
                      <li className="text-sm">Role as a key component in international trade settlement systems</li>
                      <li className="text-sm">
                        Participation in a multi-currency future where digital assets and traditional currencies coexist
                      </li>
                      <li className="text-sm">Evolution into a broader financial services platform beyond payments</li>
                      <li className="text-sm">
                        Adoption as reserve asset by certain central banks and financial institutions
                      </li>
                    </ul>
                  </div>
                </div>

                <Alert className="bg-blue-900/20 border-blue-800/30 mt-6">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-200">
                    This timeline is speculative and depends on many factors including regulatory developments,
                    technological advancements, and market adoption rates.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="section-divider"></div>

        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-3 sm:mb-0">Looking for more detailed information about XRP?</div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-700/50" asChild>
              <Link href="https://ripple.com/xrp" target="_blank" rel="noopener noreferrer">
                Official XRP Site
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="bg-slate-800/50 border-slate-700/50" asChild>
              <Link href="https://xrpl.org/" target="_blank" rel="noopener noreferrer">
                XRP Ledger Docs
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
