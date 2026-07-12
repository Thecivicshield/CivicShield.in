import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Sparkles, Trophy, Plus, Trash2, Edit2 } from "lucide-react";
import { motion } from "motion/react";

export interface MetricItem {
  label: string;
  value: number;
}

interface ImpactMetricsSectionProps {
  key?: string;
  metrics: MetricItem[];
  isAdmin: boolean;
  onUpdateMetrics: (newMetrics: MetricItem[]) => void;
  accentColor: string;
}

export default function ImpactMetricsSection({
  metrics,
  isAdmin,
  onUpdateMetrics,
  accentColor
}: ImpactMetricsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 350 });
  const [hoveredBar, setHoveredBar] = useState<MetricItem | null>(null);

  // Fallback defaults
  const activeMetrics = metrics && metrics.length > 0 ? metrics : [
    { label: "Supporters Recruited", value: 340 },
    { label: "Students Engaged", value: 1250 },
    { label: "Guides Distributed", value: 850 },
    { label: "Campus Workshops", value: 18 }
  ];

  // Observe container size for responsiveness
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        // set dimensions (allow some padding)
        const chartWidth = Math.max(320, Math.min(width - 24, 750));
        setDimensions({ width: chartWidth, height: 320 });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Compute and draw chart using D3
  useEffect(() => {
    if (!svgRef.current || activeMetrics.length === 0) return;

    // Clear previous elements
    d3.select(svgRef.current).selectAll("*").remove();

    const margin = { top: 30, right: 20, bottom: 50, left: 55 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale
    const x = d3.scaleBand()
      .range([0, width])
      .domain(activeMetrics.map(d => d.label))
      .padding(0.35);

    // Y scale
    const maxVal = d3.max(activeMetrics, d => d.value) || 100;
    const y = d3.scaleLinear()
      .domain([0, maxVal * 1.15]) // add 15% breathing room at the top
      .range([height, 0]);

    // X Axis with clean typography
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("textAnchor", "middle")
      .attr("dy", "1em")
      .attr("fill", "#9ca3af")
      .attr("fontSize", "10px")
      .attr("fontFamily", "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace")
      .style("text-transform", "uppercase")
      .style("letter-spacing", "0.05em")
      .each(function() {
        // Wrap labels if they are too long
        const text = d3.select(this);
        const words = text.text().split(/\s+/);
        if (words.length > 2 && width < 450) {
          text.text(words.slice(0, 2).join(" ") + "...");
        }
      });

    // Hide X axis domain line and style grid lines
    svg.selectAll(".domain").attr("stroke", "#374151").attr("stroke-opacity", 0.4);
    svg.selectAll(".tick line").attr("stroke", "#374151").attr("stroke-opacity", 0.4);

    // Y Axis with responsive ticks
    const yAxis = d3.axisLeft(y)
      .ticks(5)
      .tickFormat(d3.format(".0f"));

    svg.append("g")
      .call(yAxis)
      .selectAll("text")
      .attr("fill", "#9ca3af")
      .attr("fontSize", "10px")
      .attr("fontFamily", "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace");

    // Y Axis Grid lines
    svg.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(() => ""))
      .selectAll(".tick line")
      .attr("stroke", "#d4af37")
      .attr("stroke-opacity", 0.08)
      .attr("strokeDasharray", "2,2");

    // Remove secondary Y domain border lines
    svg.selectAll(".grid .domain").remove();

    // Gradient definitions for bars
    const defs = svg.append("defs");
    const barGradient = defs.append("linearGradient")
      .attr("id", "bar-glow-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");

    barGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#002366")
      .attr("stop-opacity", 0.9);

    barGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", accentColor)
      .attr("stop-opacity", 0.85);

    // 1. Blueprint vertical guide lines:
    // Append dashed gold draft lines representing the blueprint architecture before the solid bars rise
    const blueprintGuides = svg.selectAll(".blueprint-guide")
      .data(activeMetrics)
      .enter()
      .append("line")
      .attr("class", "blueprint-guide")
      .attr("x1", d => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr("x2", d => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr("y1", height)
      .attr("y2", height)
      .attr("stroke", "#d4af37")
      .attr("stroke-opacity", 0.45)
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3");

    blueprintGuides.transition()
      .duration(700)
      .delay((d, i) => i * 100)
      .attr("y2", d => y(d.value));

    // 2. Connecting trend lines growing across top coordinates
    const lineGenerator = d3.line<MetricItem>()
      .x(d => (x(d.label) || 0) + x.bandwidth() / 2)
      .y(d => y(d.value));

    const pathData = lineGenerator(activeMetrics);

    if (pathData) {
      const path = svg.append("path")
        .attr("d", pathData)
        .attr("fill", "none")
        .attr("stroke", "#d4af37")
        .attr("stroke-width", 1.5)
        .attr("stroke-opacity", 0.6)
        .attr("stroke-dasharray", "4,4");

      const pathNode = path.node() as SVGPathElement | null;
      const totalLength = pathNode ? pathNode.getTotalLength() : 800;

      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1200)
        .delay(300)
        .attr("stroke-dashoffset", 0);
    }

    // 3. Solid Bars rising from bottom
    const bars = svg.selectAll(".bar")
      .data(activeMetrics)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.label) || 0)
      .attr("width", x.bandwidth())
      .attr("y", height) // start animation from bottom
      .attr("height", 0)
      .attr("rx", 3) // slightly rounded top edges
      .attr("ry", 3)
      .attr("fill", "url(#bar-glow-gradient)")
      .attr("stroke", accentColor)
      .attr("strokeWidth", 1.5)
      .attr("stroke-opacity", 0.6)
      .attr("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr("fill-opacity", 1.0)
          .attr("stroke-opacity", 1.0)
          .attr("strokeWidth", 2.2);
        setHoveredBar(d);
      })
      .on("mouseleave", function() {
        d3.select(this)
          .transition()
          .duration(150)
          .attr("fill-opacity", 0.9)
          .attr("stroke-opacity", 0.6)
          .attr("strokeWidth", 1.5);
        setHoveredBar(null);
      });

    // Elegant animated enter transition for bars delayed slightly after blueprint guides draw
    bars.transition()
      .duration(1000)
      .delay((d, i) => 400 + i * 110)
      .attr("y", d => y(d.value))
      .attr("height", d => height - y(d.value));

    // 4. Values counting upwards on top of bars
    const barLabels = svg.selectAll(".bar-label")
      .data(activeMetrics)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", d => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr("y", height - 6) // start near bottom
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff")
      .attr("font-size", "11px")
      .attr("font-weight", "600")
      .attr("font-family", "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace")
      .attr("pointer-events", "none")
      .text(0);

    barLabels.transition()
      .duration(1100)
      .delay((d, i) => 400 + i * 110)
      .attr("y", d => y(d.value) - 8)
      .tween("text", function(d) {
        const i = d3.interpolateNumber(0, d.value);
        return function(t) {
          d3.select(this).text(Math.round(i(t)).toLocaleString());
        };
      });

  }, [dimensions, activeMetrics, accentColor]);

  // Handle Form state changes
  const handleEditMetric = (index: number, key: keyof MetricItem, value: any) => {
    const next = [...activeMetrics];
    if (key === "value") {
      const numVal = parseInt(value, 10);
      next[index] = { ...next[index], value: isNaN(numVal) ? 0 : numVal };
    } else {
      next[index] = { ...next[index], [key]: value };
    }
    onUpdateMetrics(next);
  };

  const handleAddMetricField = () => {
    const next = [...activeMetrics, { label: "New Milestone", value: 10 }];
    onUpdateMetrics(next);
  };

  const handleDeleteMetricField = (index: number) => {
    const next = activeMetrics.filter((_, i) => i !== index);
    onUpdateMetrics(next);
  };

  return (
    <motion.section 
      id="impact-metrics" 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-24 bg-[#001233] border-t border-[#d4af37]/25 relative overflow-hidden"
    >
      {/* Background radial elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,#001a4d_0%,#001233_70%)] pointer-events-none" />
      <div className="absolute -bottom-24 right-12 w-[450px] h-[450px] rounded-full bg-[#d4af37]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-mono tracking-wider uppercase mb-4">
            <Trophy className="w-3.5 h-3.5" /> Campaign Milestones
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal italic tracking-tight text-white mb-4">
            Measuring Our <span className="text-[#d4af37] font-serif not-italic">Impact</span>
          </h2>
          <p className="text-gray-300 text-sm max-w-xl mx-auto leading-relaxed font-light">
            We quantify legal literacy. By tracking processed support requests, public seminars, and legal objections, we gauge our progress in erasing procedural anxiety.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Chart Display Visual Area - spanning 7 cols */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-7 bg-[#001a4d]/85 p-6 sm:p-8 rounded-sm border border-[#d4af37]/15 shadow-2xl relative"
          >
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-[9px] font-mono font-bold py-1 px-2 uppercase rounded-sm">
              <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-ping" />
              Live D3 Render Stream
            </div>

            <h3 className="text-base font-serif text-white tracking-widest uppercase mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d4af37]" /> Key Quantitative Progress
            </h3>

            {/* D3 container */}
            <div ref={containerRef} className="w-full flex justify-center items-center overflow-x-auto min-h-[340px]">
              {activeMetrics.length > 0 ? (
                <svg ref={svgRef} className="max-w-full block"></svg>
              ) : (
                <div className="text-center text-xs text-gray-500 py-20 italic">
                  No data elements defined to map out chart vectors.
                </div>
              )}
            </div>

            {/* Tooltip description */}
            <div className="mt-4 border-t border-[#d4af37]/15 pt-4 flex items-center justify-between text-[11px] text-gray-400 font-mono">
              <p>Hover over metric vectors for detailed focus highlights.</p>
              {hoveredBar && (
                <span className="bg-[#d4af37]/15 text-[#d4af37] px-2.5 py-1 rounded-sm border border-[#d4af37]/25 font-bold">
                  {hoveredBar.label}: {hoveredBar.value}
                </span>
              )}
            </div>
          </motion.div>

          {/* Quick Metrics Cards Display - spanning 5 cols */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-6">
            
            {/* Realtime Cards list */}
            <div className="grid grid-cols-2 gap-4">
              {activeMetrics.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-[#001233]/90 border border-[#d4af37]/15 p-5 rounded-sm hover:border-[#d4af37]/45 transition-colors text-center flex flex-col justify-between"
                >
                  <p className="text-[10px] font-mono text-[#d4af37] uppercase tracking-widest leading-relaxed line-clamp-1">
                    {item.label}
                  </p>
                  <p className="text-4xl font-serif font-normal italic text-white mt-2 mb-1">
                    {item.value.toLocaleString()}
                  </p>
                  <span className="text-[8px] font-mono uppercase text-gray-400 font-bold self-center py-0.5 px-2 bg-slate-900 border border-white/5 rounded-sm">
                    Verified
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Admin Metrics Inputs Panel */}
            {isAdmin && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#001c4a] border border-dashed border-[#d4af37]/40 p-5 rounded-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase font-bold text-[#d4af37]">
                    🔧 Configure Impact Milestones
                  </h4>
                  <button
                    onClick={handleAddMetricField}
                    className="flex items-center gap-1 text-[10px] uppercase font-mono font-bold text-white bg-[#d4af37]/20 border border-[#d4af37]/35 px-2.5 py-1 rounded-sm hover:bg-[#d4af37]/45 cursor-pointer transition-all"
                  >
                    <Plus className="w-3 h-3" /> Add Milestone
                  </button>
                </div>

                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                  {activeMetrics.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-[#001233]/90 p-2 border border-[#d4af37]/15 rounded-sm">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => handleEditMetric(idx, "label", e.target.value)}
                        placeholder="Milestone label text..."
                        className="flex-1 bg-[#001c4a] text-xs text-white placeholder-gray-500 p-1.5 focus:outline-none border border-white/10 rounded-sm"
                      />
                      <input
                        type="number"
                        value={item.value}
                        onChange={(e) => handleEditMetric(idx, "value", e.target.value)}
                        placeholder="Qty"
                        className="w-16 bg-[#001c4a] text-xs font-mono text-[#d4af37] font-bold p-1.5 focus:outline-none border border-white/10 rounded-sm"
                      />
                      <button
                        onClick={() => handleDeleteMetricField(idx)}
                        className="p-1.5 text-red-400 hover:text-white hover:bg-red-950/40 border border-red-500/15 rounded-sm transition-all"
                        title="Remove milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 italic">
                  Changes automatically compile down and update live vectors on the graph stream above.
                </p>
              </motion.div>
            )}

          </div>

        </div>

      </div>
    </motion.section>
  );
}
