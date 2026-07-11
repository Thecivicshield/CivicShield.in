import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { 
  Map, 
  MapPin, 
  Shield, 
  Plus, 
  Trash2, 
  Filter, 
  Sliders, 
  Sparkles, 
  Check, 
  AlertTriangle, 
  X,
  Target,
  RefreshCw,
  Locate,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Define TypeScript interfaces for our interactive D3 map
export interface DeploymentPoint {
  id: string;
  name: string;
  category: "Campaign Reach" | "Event Locations" | "High-Impact Areas";
  x: number; // 0 - 1000 coordinate space
  y: number; // 0 - 600 coordinate space
  description: string;
  metric: string;
  active: boolean; // Admin-controllable toggle
  district: string;
}

// Initial robust strategic locations
const INITIAL_POINTS: DeploymentPoint[] = [
  {
    id: "site-1",
    name: "Sovereign Port Outreach Hub",
    category: "Campaign Reach",
    x: 220,
    y: 160,
    description: "Active legal counseling kiosk and distribution point for the 'Know Your Rights' digital manuals.",
    metric: "840+ Citizens Briefed",
    active: true,
    district: "Sovereign Port"
  },
  {
    id: "site-2",
    name: "Civic Ridge Procedural Clinic",
    category: "Event Locations",
    x: 480,
    y: 220,
    description: "Bi-weekly community workshop for contesting arbitrary municipal eviction and demolition notices.",
    metric: "32 Cases Prepared",
    active: true,
    district: "Civic Ridge"
  },
  {
    id: "site-3",
    name: "Central High-Impact Sanctuary",
    category: "High-Impact Areas",
    x: 580,
    y: 360,
    description: "Warrantless Seizure Exclusion zone. A coordinated local block with unified video legal surveillance.",
    metric: "0 Warrantless Intrusions Allowed",
    active: true,
    district: "Central District"
  },
  {
    id: "site-4",
    name: "Sovereign Square Advocacy Meet",
    category: "Event Locations",
    x: 320,
    y: 410,
    description: "Public teach-in demonstrating right of Party-In-Person courtroom defense under Advocates Act.",
    metric: "180+ Attendees Trained",
    active: true,
    district: "Sovereign Port"
  },
  {
    id: "site-5",
    name: "Cyber Quarter Digital Guard",
    category: "Campaign Reach",
    x: 720,
    y: 150,
    description: "Secure legal consultation digital relay node and pro-bono chat defense network infrastructure.",
    metric: "2,400+ Secure Chats Routed",
    active: true,
    district: "Cyber Quarter"
  },
  {
    id: "site-6",
    name: "East Industrial Defense Block",
    category: "High-Impact Areas",
    x: 240,
    y: 490,
    description: "Factory laborer advocacy alliance. Formed active shield defense network protecting against systemic wages theft.",
    metric: "4 Local Guilds Synchronized",
    active: true,
    district: "East Industrial"
  }
];

export default function StrategicDeploymentMap({ isAdmin }: { isAdmin: boolean; key?: string }) {
  // Persistence state
  const [points, setPoints] = useState<DeploymentPoint[]>(() => {
    try {
      const saved = localStorage.getItem("civic_shield_deployment_points");
      return saved ? JSON.parse(saved) : INITIAL_POINTS;
    } catch {
      return INITIAL_POINTS;
    }
  });

  // Filters State
  const [showReach, setShowReach] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [showImpact, setShowImpact] = useState(true);

  // Hovered or Clicked inspection target
  const [hoveredPoint, setHoveredPoint] = useState<DeploymentPoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<DeploymentPoint | null>(null);

  // New Node Form State
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [newX, setNewX] = useState<number | null>(null);
  const [newY, setNewY] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<"Campaign Reach" | "Event Locations" | "High-Impact Areas">("Campaign Reach");
  const [newDesc, setNewDesc] = useState("");
  const [newMetric, setNewMetric] = useState("");
  const [newDistrict, setNewDistrict] = useState("Central District");

  // SVG dimensions
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("civic_shield_deployment_points", JSON.stringify(points));
    } catch (e) {
      console.error("Could not write deployment points to localStorage:", e);
    }
  }, [points]);

  // Handle ResizeObserver to update width and height dynamically
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        // Keep 16:10 or similar aspect ratio but bounded nicely
        const calcHeight = Math.max(380, Math.min(500, width * 0.58));
        setDimensions({
          width: Math.max(500, width),
          height: calcHeight
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Sync D3 Visualization
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    // Clear previous dynamic elements (except static layers) to redraw safely
    svg.select(".dynamic-layers").selectAll("*").remove();

    const { width, height } = dimensions;

    // Standard scale functions mapping virtual coords [0 - 1000, 0 - 600] to current SVG size
    const xScale = d3.scaleLinear().domain([0, 1000]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 600]).range([0, height]);

    const dynamicLayer = svg.select(".dynamic-layers");

    // Filter points based on active toggles
    const filteredPoints = points.filter(p => {
      if (!p.active) return false; // suppressed by admin
      if (p.category === "Campaign Reach" && !showReach) return false;
      if (p.category === "Event Locations" && !showEvents) return false;
      if (p.category === "High-Impact Areas" && !showImpact) return false;
      return true;
    });

    // 1. Draw connecting visual grids/streets network (cyber-styling)
    // We create a few beautiful glowing pathways representing cyber-arteries connecting major hubs
    const roadsData = [
      [[150, 150], [480, 220], [580, 360]],
      [[240, 490], [320, 410], [580, 360]],
      [[720, 150], [480, 220], [320, 410]],
      [[220, 160], [320, 410], [240, 490]]
    ];

    const lineGenerator = d3.line<number[]>()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]))
      .curve(d3.curveCatmullRom.alpha(0.5));

    dynamicLayer.selectAll(".grid-artery")
      .data(roadsData)
      .enter()
      .append("path")
      .attr("class", "grid-artery")
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", "#d4af37")
      .attr("stroke-width", 0.75)
      .attr("stroke-dasharray", "4, 6")
      .attr("opacity", 0.18);

    // 2. Draw pulsing concentric rings around High-Impact Areas
    const impactSites = filteredPoints.filter(p => p.category === "High-Impact Areas");
    
    // Ring loops
    const pulseGroups = dynamicLayer.selectAll(".pulse-ring-group")
      .data(impactSites)
      .enter()
      .append("g")
      .attr("class", "pulse-ring-group")
      .attr("transform", (d: any) => `translate(${xScale(d.x)}, ${yScale(d.y)})`);

    // Triple expanding rings
    [1, 2, 3].forEach((lvl) => {
      pulseGroups.append("circle")
        .attr("r", 0)
        .attr("fill", "none")
        .attr("stroke", "#ef4444")
        .attr("stroke-width", 1)
        .attr("opacity", 0.8)
        .transition()
        .duration(3000)
        .delay((d: any, i) => lvl * 1000)
        .on("start", function repeat() {
          d3.active(this)
            ?.attr("r", 0)
            .attr("opacity", 0.8)
            .transition()
            .duration(3000)
            .attr("r", 40 * lvl)
            .attr("opacity", 0)
            .on("start", repeat);
        });
    });

    // 3. Render Nodes
    const nodeGroups = dynamicLayer.selectAll(".deployment-node")
      .data(filteredPoints, (d: any) => d.id)
      .enter()
      .append("g")
      .attr("class", "deployment-node cursor-pointer")
      .attr("transform", (d: any) => `translate(${xScale(d.x)}, ${yScale(d.y)})`)
      .on("mouseover", (event, d: any) => {
        setHoveredPoint(d);
      })
      .on("mouseleave", () => {
        setHoveredPoint(null);
      })
      .on("click", (event, d: any) => {
        event.stopPropagation();
        setSelectedPoint(d);
        // Play a subtle high-tech radar sweep flash
        d3.select(event.currentTarget)
          .select(".node-core")
          .transition()
          .duration(150)
          .attr("transform", "scale(1.7)")
          .transition()
          .duration(300)
          .attr("transform", "scale(1)");
      });

    // Node Cores styling depending on category
    nodeGroups.each(function(d: any) {
      const group = d3.select(this);

      // Background touch target buffer
      group.append("circle")
        .attr("r", 18)
        .attr("fill", "transparent");

      if (d.category === "Campaign Reach") {
        // Glowing cyan circles
        group.append("circle")
          .attr("class", "node-glow")
          .attr("r", 8)
          .attr("fill", "#06b6d4")
          .attr("opacity", 0.25)
          .attr("filter", "blur(2px)");

        group.append("circle")
          .attr("class", "node-core")
          .attr("r", 5)
          .attr("fill", "#06b6d4")
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 1);

        // Rotating dashed dash ring
        group.append("circle")
          .attr("r", 10)
          .attr("fill", "none")
          .attr("stroke", "#06b6d4")
          .attr("stroke-width", 0.75)
          .attr("stroke-dasharray", "2, 3")
          .attr("opacity", 0.6);

      } else if (d.category === "Event Locations") {
        // Star / Triangle Gold indicator
        group.append("path")
          .attr("class", "node-core")
          .attr("d", d3.symbol().type(d3.symbolTriangle).size(65)())
          .attr("fill", "#d4af37")
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 0.75);

        // Thin outer coordinate box
        group.append("rect")
          .attr("x", -7)
          .attr("y", -7)
          .attr("width", 14)
          .attr("height", 14)
          .attr("fill", "none")
          .attr("stroke", "#d4af37")
          .attr("stroke-width", 0.5)
          .attr("opacity", 0.5);

      } else if (d.category === "High-Impact Areas") {
        // Red Diamonds with intense spikes
        group.append("path")
          .attr("class", "node-core")
          .attr("d", d3.symbol().type(d3.symbolDiamond).size(80)())
          .attr("fill", "#ef4444")
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 1);

        // Crosshairs lines
        group.append("line")
          .attr("x1", -12).attr("y1", 0).attr("x2", 12).attr("y2", 0)
          .attr("stroke", "#ef4444").attr("stroke-width", 0.5).attr("opacity", 0.7);
        group.append("line")
          .attr("x1", 0).attr("y1", -12).attr("x2", 0).attr("y2", 12)
          .attr("stroke", "#ef4444").attr("stroke-width", 0.5).attr("opacity", 0.7);
      }

      // Add a subtle name abbreviation tags
      group.append("text")
        .attr("y", 16)
        .attr("text-anchor", "middle")
        .attr("fill", "#ffffff")
        .attr("font-family", "monospace")
        .attr("font-size", "7.5px")
        .attr("font-weight", "500")
        .attr("opacity", 0.75)
        .text(d.name.split(" ").slice(0, 2).join(" "));
    });

  }, [points, dimensions, showReach, showEvents, showImpact]);

  // Click on map to trigger Coordinate selection for new node (Admin Only)
  const handleMapClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!isAdmin) return;
    
    const svgRect = svgRef.current?.getBoundingClientRect();
    if (!svgRect) return;

    // Calculate real offset position relative to the SVG container
    const clickX = event.clientX - svgRect.left;
    const clickY = event.clientY - svgRect.top;

    // Scale back to 0 - 1000, 0 - 600 virtual units
    const virtualX = Math.round((clickX / svgRect.width) * 1000);
    const virtualY = Math.round((clickY / svgRect.height) * 600);

    setNewX(virtualX);
    setNewY(virtualY);
    setIsAddingNode(true);

    // Auto assign district based on coordinates
    if (virtualX < 350 && virtualY < 300) setNewDistrict("Sovereign Port");
    else if (virtualX >= 350 && virtualX < 650 && virtualY < 300) setNewDistrict("Civic Ridge");
    else if (virtualX >= 650 && virtualY < 350) setNewDistrict("Cyber Quarter");
    else if (virtualX < 400 && virtualY >= 300) setNewDistrict("East Industrial");
    else setNewDistrict("Central District");
  };

  // Submit and deploy new node
  const handleCreateNodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newX === null || newY === null) return;

    const newNode: DeploymentPoint = {
      id: `custom-site-${Date.now()}`,
      name: newName,
      category: newCategory,
      x: newX,
      y: newY,
      description: newDesc || "Custom secure operational node established by Civil Counsel admins.",
      metric: newMetric || "Operational // Grid Synced",
      active: true,
      district: newDistrict
    };

    setPoints(prev => [...prev, newNode]);
    setSelectedPoint(newNode);
    
    // Clear state
    setNewName("");
    setNewDesc("");
    setNewMetric("");
    setIsAddingNode(false);
    setNewX(null);
    setNewY(null);
  };

  // Toggle active status (Visibility) of a point (Admin Only)
  const handleTogglePointActive = (id: string) => {
    setPoints(prev => prev.map(p => {
      if (p.id === id) {
        const nextActive = !p.active;
        // If we are turning it off, and it was currently selected, deselect it
        if (!nextActive && selectedPoint?.id === id) {
          setSelectedPoint(null);
        }
        return { ...p, active: nextActive };
      }
      return p;
    }));
  };

  // Delete a point completely (Admin Only)
  const handleDeletePoint = (id: string) => {
    if (confirm("Are you sure you want to delete this strategic node from the city deployment map?")) {
      setPoints(prev => prev.filter(p => p.id !== id));
      if (selectedPoint?.id === id) {
        setSelectedPoint(null);
      }
    }
  };

  // Restore Default coordinates config
  const handleRestoreDefaults = () => {
    if (confirm("Restore map nodes to default operational campaign locations?")) {
      setPoints(INITIAL_POINTS);
      setSelectedPoint(null);
      setHoveredPoint(null);
      localStorage.removeItem("civic_shield_deployment_points");
    }
  };

  return (
    <section 
      id="deployment-map"
      className="py-20 border-b border-[#d4af37]/25 bg-[#000d26] relative overflow-hidden"
    >
      {/* Visual background vector accents */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#d4af37]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#06b6d4]/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block with HUD subtitle */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/25 rounded-full">
            <Target className="w-3 h-3 text-[#d4af37] animate-pulse" />
            <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[#d4af37]">STABILITY AND COVERAGE MATRIX</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white uppercase tracking-tight">
            Strategic Deployment Map
          </h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-gray-400 font-sans font-light leading-relaxed">
            Real-time visual map of the Civil Counsel Alliance campaigns. Track counseling hubs, advocacy workshops, and critical safe zones across our defense network.
          </p>
        </div>

        {/* Outer Dashboard Flex Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT AREA: MAP SVG CANVAS (takes 8 columns) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Legend and filters toolbar */}
            <div className="p-3 bg-[#001233]/90 border border-[#d4af37]/20 rounded-sm flex flex-wrap items-center justify-between gap-4">
              {/* Legend with Interactive Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-[10px] font-mono font-bold uppercase text-gray-400 flex items-center gap-1.5 mr-2">
                  <Filter className="w-3.5 h-3.5" /> Filter Map Layers:
                </span>

                {/* Campaign Reach */}
                <button
                  onClick={() => setShowReach(!showReach)}
                  className={`flex items-center gap-2 px-2.5 py-1 rounded-sm border text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    showReach 
                      ? "bg-[#06b6d4]/10 border-[#06b6d4]/40 text-white" 
                      : "bg-[#000]/40 border-gray-800 text-gray-500"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${showReach ? 'bg-[#06b6d4]' : 'bg-gray-700'}`} />
                  <span>Campaign Reach ({points.filter(p => p.active && p.category === "Campaign Reach").length})</span>
                </button>

                {/* Event Locations */}
                <button
                  onClick={() => setShowEvents(!showEvents)}
                  className={`flex items-center gap-2 px-2.5 py-1 rounded-sm border text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    showEvents 
                      ? "bg-[#d4af37]/10 border-[#d4af37]/40 text-white" 
                      : "bg-[#000]/40 border-gray-800 text-gray-500"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-sm rotate-45 ${showEvents ? 'bg-[#d4af37]' : 'bg-gray-700'}`} />
                  <span>Event Sites ({points.filter(p => p.active && p.category === "Event Locations").length})</span>
                </button>

                {/* High-Impact Areas */}
                <button
                  onClick={() => setShowImpact(!showImpact)}
                  className={`flex items-center gap-2 px-2.5 py-1 rounded-sm border text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    showImpact 
                      ? "bg-[#ef4444]/10 border-[#ef4444]/40 text-white" 
                      : "bg-[#000]/40 border-gray-800 text-gray-500"
                  }`}
                >
                  <span className={`w-2 h-2 rotate-45 shrink-0 ${showImpact ? 'bg-[#ef4444] animate-pulse' : 'bg-gray-700'}`} />
                  <span>High-Impact Areas ({points.filter(p => p.active && p.category === "High-Impact Areas").length})</span>
                </button>
              </div>

              {/* Reset to defaults (Admins or users) */}
              <button
                onClick={handleRestoreDefaults}
                className="py-1 px-2.5 border border-gray-800 hover:border-gray-500 rounded-sm bg-black/40 text-gray-400 hover:text-white transition-all text-[8px] font-mono uppercase flex items-center gap-1.5 cursor-pointer"
                title="Restore default database nodes"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>RESTORE</span>
              </button>
            </div>

            {/* MAP CONTAINER CANVAS PANEL */}
            <div 
              ref={containerRef}
              className="relative rounded-sm border border-[#d4af37]/30 bg-black/80 overflow-hidden shadow-2xl min-h-[380px]"
            >
              {/* Futuristic Vector Background Lines & Grid */}
              <div className="absolute inset-0 bg-grid-lines pointer-events-none opacity-10" />
              
              {/* Instruction banner if in admin mode */}
              {isAdmin && (
                <div className="absolute top-2 left-2 z-20 pointer-events-none bg-black/75 border border-[#d4af37]/30 px-2 py-1 rounded-sm">
                  <p className="text-[7.5px] font-mono text-[#d4af37] tracking-wider uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-ping" />
                    <span>ADMIN MODE: CLICK GRID CANVAS TO DEPLOY A NEW LOGISTICAL NODE</span>
                  </p>
                </div>
              )}

              {/* D3 SVG Canvas */}
              <svg
                ref={svgRef}
                width={dimensions.width}
                height={dimensions.height}
                onClick={handleMapClick}
                className="relative block max-w-full h-auto"
              >
                {/* STATIC BACKGROUND GRID AND SECTOR BOXES DRAWN VIA SVG */}
                <g className="static-background-layers pointer-events-none opacity-40">
                  {/* Outer circle coordinates radar compass */}
                  <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#d4af37" strokeWidth="0.5" strokeDasharray="10, 8" />
                  <circle cx="50%" cy="50%" r="20%" fill="none" stroke="#d4af37" strokeWidth="0.25" strokeDasharray="2, 4" />
                  
                  {/* Quadrant grid dividers */}
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#d4af37" strokeWidth="0.5" strokeDasharray="6, 8" />
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#d4af37" strokeWidth="0.5" strokeDasharray="6, 8" />

                  {/* Sector Name labels */}
                  <text x="5%" y="10%" fill="#d4af37" opacity="0.4" fontFamily="monospace" fontSize="7px" fontWeight="bold">SOVEREIGN PORT // SECTOR_A</text>
                  <text x="95%" y="10%" textAnchor="end" fill="#d4af37" opacity="0.4" fontFamily="monospace" fontSize="7px" fontWeight="bold">CYBER QUARTER // SECTOR_B</text>
                  <text x="5%" y="95%" fill="#d4af37" opacity="0.4" fontFamily="monospace" fontSize="7px" fontWeight="bold">EAST INDUSTRIAL // SECTOR_C</text>
                  <text x="95%" y="95%" textAnchor="end" fill="#d4af37" opacity="0.4" fontFamily="monospace" fontSize="7px" fontWeight="bold">CIVIC RIDGE // SECTOR_D</text>
                </g>

                {/* D3 Dynamic render layers are mounted here */}
                <g className="dynamic-layers" />
              </svg>

              {/* Visual radar scanning sweep overlay */}
              <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent pointer-events-none animate-radar-sweep z-10" />

              {/* SVG HUD Crosshair indicators when hovering/clicking */}
              <AnimatePresence>
                {hoveredPoint && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.9 }}
                    exit={{ opacity: 0 }}
                    className="absolute pointer-events-none bg-black/90 border border-gray-700 p-2 rounded-sm shadow-xl z-20 font-mono text-[8px]"
                    style={{
                      left: `${(hoveredPoint.x / 1000) * 100}%`,
                      top: `${(hoveredPoint.y / 600) * 100}%`,
                      transform: 'translate(14px, -50%)'
                    }}
                  >
                    <p className="text-white font-bold uppercase">{hoveredPoint.name}</p>
                    <p className="text-[#d4af37] font-semibold">{hoveredPoint.category}</p>
                    <p className="text-[#00ffcc] text-[7px] mt-0.5">{hoveredPoint.district} (X: {hoveredPoint.x}, Y: {hoveredPoint.y})</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT AREA: DETAIL PANEL / ADMIN site list (takes 4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* INSPECT OR CLICK DETAILS DISPLAY CARD */}
            <div className="bg-[#001233]/90 border border-[#d4af37]/25 rounded-sm p-4 text-left shadow-xl space-y-4 relative">
              <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-2">
                <div className="flex items-center gap-1.5">
                  <Locate className="w-4 h-4 text-[#d4af37]" />
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Node Inspection</h4>
                </div>
                {selectedPoint && (
                  <button 
                    onClick={() => setSelectedPoint(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {selectedPoint ? (
                /* Selected node details */
                <div className="space-y-4 font-mono text-[10px] leading-relaxed animate-in fade-in slide-in-from-right-3 duration-200">
                  <div className="space-y-1">
                    <span className="text-[7.5px] uppercase tracking-widest text-[#d4af37]/75 font-bold block">Location Ident</span>
                    <h5 className="text-sm font-sans font-bold text-white uppercase tracking-wide leading-tight">{selectedPoint.name}</h5>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-black/40 border border-[#d4af37]/20 rounded-full text-[8px] text-gray-300">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        selectedPoint.category === "Campaign Reach" 
                          ? "bg-[#06b6d4]" 
                          : selectedPoint.category === "Event Locations" 
                            ? "bg-[#d4af37]" 
                            : "bg-[#ef4444]"
                      }`} />
                      <span>{selectedPoint.category}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-y border-gray-800/60 py-2.5">
                    <div>
                      <span className="text-gray-500 block text-[7.5px] uppercase font-bold">District sector</span>
                      <span className="text-white text-[9px] font-medium uppercase">{selectedPoint.district}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[7.5px] uppercase font-bold">Grid Coords</span>
                      <span className="text-white text-[9px] font-medium">X: {selectedPoint.x} | Y: {selectedPoint.y}</span>
                    </div>
                  </div>

                  <div className="space-y-1 bg-black/40 p-2.5 rounded border border-[#d4af37]/10">
                    <span className="text-gray-500 block text-[7.5px] uppercase font-bold">Operational Scope</span>
                    <p className="text-gray-300 text-[9px] leading-relaxed font-sans font-light">{selectedPoint.description}</p>
                  </div>

                  <div className="p-2 bg-[#d4af37]/10 border border-[#d4af37]/20 rounded-sm text-center">
                    <span className="text-[#d4af37] block text-[7.5px] uppercase font-bold">Impact Metric Accumulation</span>
                    <span className="text-white text-xs font-bold font-sans tracking-wide">{selectedPoint.metric}</span>
                  </div>
                </div>
              ) : (
                /* Empty state / Prompt click */
                <div className="text-center py-10 space-y-2">
                  <MapPin className="w-8 h-8 text-gray-600 mx-auto animate-bounce" />
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Awaiting Site Target</p>
                  <p className="text-[9px] text-gray-500 max-w-xs mx-auto leading-relaxed">
                    Click any node or interactive link on the city deployment grid to load active metrics and tactical operational details.
                  </p>
                </div>
              )}
            </div>

            {/* ADVISORY ADD NODE MODAL FORM (Admins Only) */}
            <AnimatePresence>
              {isAdmin && isAddingNode && newX !== null && newY !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-[#001233]/90 border border-[#d4af37] rounded-sm p-4 text-left shadow-2xl relative space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-[#d4af37]" />
                      <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Register New Node</h4>
                    </div>
                    <button 
                      onClick={() => setIsAddingNode(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateNodeSubmit} className="space-y-3 font-mono text-[9px] text-left">
                    <div className="grid grid-cols-2 gap-2 text-gray-400 bg-black/40 p-1.5 border border-gray-800 rounded">
                      <span>X Coordinate: <span className="text-white font-bold">{newX}</span></span>
                      <span>Y Coordinate: <span className="text-white font-bold">{newY}</span></span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 uppercase block font-bold">Node Name</label>
                      <input 
                        type="text" 
                        required
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g. West Coast Legal Shield"
                        className="w-full bg-black border border-gray-800 text-white p-1.5 text-[9.5px] rounded-sm focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 uppercase block font-bold">Classification Layer</label>
                      <select
                        value={newCategory}
                        onChange={(e: any) => setNewCategory(e.target.value)}
                        className="w-full bg-black border border-gray-800 text-white p-1.5 text-[9.5px] rounded-sm focus:outline-none focus:border-[#d4af37]"
                      >
                        <option value="Campaign Reach">Campaign Reach (Cyan Circle)</option>
                        <option value="Event Locations">Event Locations (Gold Star)</option>
                        <option value="High-Impact Areas">High-Impact Areas (Red Diamond)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-gray-400 uppercase block font-bold">District sector</label>
                        <input 
                          type="text" 
                          value={newDistrict}
                          onChange={(e) => setNewDistrict(e.target.value)}
                          className="w-full bg-black border border-gray-800 text-white p-1.5 text-[9.5px] rounded-sm focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-gray-400 uppercase block font-bold">Impact Metric Text</label>
                        <input 
                          type="text" 
                          value={newMetric}
                          onChange={(e) => setNewMetric(e.target.value)}
                          placeholder="e.g. 150+ Handbooks"
                          className="w-full bg-black border border-gray-800 text-white p-1.5 text-[9.5px] rounded-sm focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 uppercase block font-bold">Brief Description</label>
                      <textarea 
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        rows={2}
                        placeholder="Write dynamic target explanation..."
                        className="w-full bg-black border border-gray-800 text-white p-1.5 text-[9.5px] rounded-sm focus:outline-none focus:border-[#d4af37]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-[#d4af37] text-[#001233] font-bold uppercase rounded-sm text-[10px] tracking-widest transition-all cursor-pointer hover:bg-white text-center flex items-center justify-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>DEPLOY STRATEGIC NODE</span>
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ADMIN MANIFEST MANAGER PANEL (Toggle Visibility and Delete Points) */}
            <div className="bg-[#001233]/90 border border-gray-800 rounded-sm p-4 text-left shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#d4af37]" />
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Site Registry Index</h4>
                </div>
                <span className="text-[7.5px] font-mono text-gray-500">TOTAL: {points.length} NODES</span>
              </div>

              {/* Index List */}
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {points.map((p) => (
                  <div 
                    key={p.id}
                    className="flex items-center justify-between p-2 rounded-sm bg-black/40 border border-gray-800/60 hover:border-gray-700 transition-all gap-3"
                  >
                    <div className="min-w-0 flex-1 flex items-center gap-1.5">
                      <span className={`w-2 h-2 shrink-0 rounded-full ${
                        p.category === "Campaign Reach" 
                          ? "bg-[#06b6d4]" 
                          : p.category === "Event Locations" 
                            ? "bg-[#d4af37]" 
                            : "bg-[#ef4444]"
                      }`} />
                      
                      <div className="min-w-0 flex-1">
                        <p className="text-[9.5px] font-mono font-semibold text-white truncate uppercase">{p.name}</p>
                        <p className="text-[7.5px] text-gray-500 truncate">{p.category} • {p.district}</p>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Toggle active button */}
                      <button
                        onClick={() => handleTogglePointActive(p.id)}
                        className={`p-1 rounded-sm border transition-all cursor-pointer ${
                          p.active 
                            ? "bg-[#d4af37]/10 border-[#d4af37]/40 text-[#d4af37]" 
                            : "bg-black/80 border-gray-800 text-gray-600"
                        }`}
                        title={p.active ? "Suppress this site on client map" : "Activate this site on client map"}
                      >
                        {p.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </button>

                      {/* Delete point button (Admin only) */}
                      {isAdmin && (
                        <button
                          onClick={() => handleDeletePoint(p.id)}
                          className="p-1 rounded-sm bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-900 hover:text-white transition-all cursor-pointer"
                          title="Erase site from database"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Informational Footer note */}
              <div className="text-[8px] text-gray-500 font-mono flex items-start gap-1.5 border-t border-gray-900 pt-3">
                <Sparkles className="w-3 h-3 text-[#d4af37] shrink-0" />
                <p className="leading-relaxed">
                  Admins can hide specific locations by toggling the eye icon. Restoring default nodes re-populates coordinates securely.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
