"use client"

import * as React from "react"
// Imports all components from the Recharts library (the underlying chart visualization tool).
import * as RechartsPrimitive from "recharts"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Configuration and Context Setup
// -----------------------------------------------------------------------------

// Format: { THEME_NAME: CSS_SELECTOR }. Used to target specific theme modes (light/dark) for styling.
const THEMES = { light: "", dark: ".dark" } as const

// Type definition for the required chart configuration object passed to the ChartContainer.
export type ChartConfig = {
  // Config keys map to data keys in the chart payload (e.g., 'revenue', 'cost').
  [k in string]: {
    label?: React.ReactNode // User-friendly label for the data key.
    icon?: React.ComponentType // Optional icon associated with the data key.
  } & (
    // Defines color using either a direct CSS color string OR a theme-specific mapping.
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

// Defines the props shape for the React Context (contains the configuration object).
type ChartContextProps = {
  config: ChartConfig
}

// Creates the React Context to share the ChartConfig object across all child chart components.
const ChartContext = React.createContext<ChartContextProps | null>(null)

// Custom hook to access the chart configuration from the context.
function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    // Throws an error if the hook is used outside of the ChartContainer.
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

// -----------------------------------------------------------------------------
// 2. ChartContainer Component
// -----------------------------------------------------------------------------

// The root component that sets up the chart context, styling, and responsiveness.
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig // Requires the configuration object.
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"] // Ensures children are valid for the Recharts ResponsiveContainer.
  }
>(({ id, className, children, config, ...props }, ref) => {
  // Generates a unique ID for the chart instance.
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}` // Creates a unique ID string like 'chart-randomid'.

  return (
    // Provides the chart configuration via context.
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId} // Custom data attribute used by ChartStyle for CSS scoping.
        ref={ref}
        className={cn(
          // Base styling: ensures flex display, maintains 16:9 aspect ratio, sets default text size.
          "flex aspect-video justify-center text-xs",
          // Comprehensive CSS selectors to target specific Recharts elements and apply custom Tailwind styling
          // (e.g., changing axis text fill, grid line stroke, tooltip cursor color).
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        {/* Generates and injects a dynamic <style> block containing CSS variables for chart colors. */}
        <ChartStyle id={chartId} config={config} />
        {/* Ensures the chart resizes correctly to fill the parent container. */}
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

// -----------------------------------------------------------------------------
// 3. ChartStyle Component (Color Theming Logic)
// -----------------------------------------------------------------------------

// Component that dynamically generates CSS variables based on the config for color theming.
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  // Filters config entries to include only those that define a 'theme' or a direct 'color'.
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      // Injects the generated CSS string directly into the DOM.
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
// Scopes the CSS variables to the specific chart instance using the data-chart attribute.
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    // Determines the color value based on the current theme ('light' or 'dark') or the direct 'color' prop.
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    // Creates a CSS variable: --color-key: #hex_value;
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

// -----------------------------------------------------------------------------
// 4. Chart Tooltip Components
// -----------------------------------------------------------------------------

// Alias for the base Recharts Tooltip component.
const ChartTooltip = RechartsPrimitive.Tooltip

// Styled content wrapper for the Recharts Tooltip, adding custom formatting, indicators, and labels.
const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  // Merges Recharts Tooltip props with standard div props and custom control props.
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed" // Type of visual indicator in the tooltip list.
      nameKey?: string // Key to use for the data item name.
      labelKey?: string // Key to use for the tooltip label.
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    // Accesses the chart configuration for labels and icons.
    const { config } = useChart()

    // Memoizes the calculation and rendering of the main tooltip label (e.g., the date or category).
    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item?.dataKey || item?.name || "value"}`
      // Helper function finds the configuration for the data item.
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      // Allows custom formatting function for the label.
      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    // Renders nothing if the tooltip is not active or has no data.
    if (!active || !payload?.length) {
      return null
    }

    // Optimization check: If only one item is shown and the indicator is not 'dot', render the label inline with the item.
    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          // Styling for the tooltip box: minimal size, rounded, border, background, shadow, small text.
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {/* Renders the label at the top if there is more than one item being displayed. */}
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {/* Maps through each data series/item in the tooltip payload. */}
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color // Determines color from props, payload fill, or item color.

            return (
              <div
                key={item.dataKey}
                className={cn(
                  // Styling for the row containing the indicator, label, and value.
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {/* Allows user to provide a custom formatter function for the entire row content. */}
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {/* Displays custom icon if defined in the config. */}
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      // Displays the default indicator (dot, line, or dashed).
                      !hideIndicator && (
                        <div
                          className={cn(
                            // Base styling for the color indicator box.
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          // Injects the dynamic color as a CSS variable for the background and border.
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {/* Renders the label inline if nestLabel is true (single payload item). */}
                        {nestLabel ? tooltipLabel : null}
                        {/* The data series label (e.g., 'Revenue'). */}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {/* The data value (e.g., 1,234.00). */}
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

// -----------------------------------------------------------------------------
// 5. Chart Legend Components
// -----------------------------------------------------------------------------

// Alias for the base Recharts Legend component.
const ChartLegend = RechartsPrimitive.Legend

// Custom content wrapper for the Recharts Legend, handling dynamic rendering based on config.
const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    // Picks required props from Recharts Legend: data items and vertical position.
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string // Key to use for the data item name.
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          // Base styling: centers items horizontally with gap.
          "flex items-center justify-center gap-4",
          // Applies vertical padding based on vertical placement (top or bottom).
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {/* Maps through each item in the legend payload. */}
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={cn(
                // Styling for the legend item (icon/indicator + label).
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {/* Renders custom icon if available, otherwise renders the default colored square. */}
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color, // Uses the color passed by Recharts for the item.
                  }}
                />
              )}
              {/* Renders the user-friendly label from the config. */}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// -----------------------------------------------------------------------------
// 6. Helper Function
// -----------------------------------------------------------------------------

// Helper to extract the chart config item associated with a specific data payload item.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  // Attempts to get the 'payload' nested property common in Recharts objects.
  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  // Tries to find the key in the top-level payload object.
  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    // Tries to find the key in the nested 'payload.payload' object.
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  // Returns the config item matching the found key, or falls back to the original key.
  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

// -----------------------------------------------------------------------------
// 7. Exports
// -----------------------------------------------------------------------------

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
