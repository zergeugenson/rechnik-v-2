interface Pad {
  id: number;
  name: string;
  url?: string;
  utm_campaign?: string;
  status?: string;
}

interface PadsList {
  items?: Pad[];
  total?: number;
}

interface reflinkPadsList {
  id: number;
  name: string;
}

interface RefLink {
  markings: string;
  platform_name: string;
  url: string;
  name: string;
}

interface RefLinkAct {
  amount?: number;
  clicks?: number;
  date_from?: string;
  date_to?: string;
  file?: string;
  id?: number;
  statistics?: {
    amount?: number;
    clicks?: number;
    file?: string;
    id?: number;
    reflink_pad_id?: number;
    reflink_pad_name?: string;
    url?: string;
  }[];
  status?: string;
}

interface RefLinkActs {
  items?: RefLinkAct[];
}

interface Card {
  period: string;
  revenue: number;
  revenue_prev: number;
  percentage: number;
}

interface StatValue {
  clicks?: number;
  date: string;
  revenue?: number;
}
interface StatsList {
  items?: {
    [key: string]: StatValue;
  };
  categories?: { id: number; name: string }[];
  data?: string;
  type?: string;
  start_date?: string;
  end_date?: string;
}
interface StatsParams {
  data: string;
  start_date: string;
  end_date: string;
  pad_ids?: string[];
  reflink_pad_ids?: string[];
  category_ids?: number[];
  type?: string;
}
interface chartOptionsInterface {
  deep?: boolean;
  accessibility?: object;
  credits?: object;
  chart?: object;
  title?: object;
  subtitle?: object;
  plotOptions?: object;
  xAxis?: {
    lineColor?: string;
    minorGridLineWidth?: number;
    tickWidth?: number;
    gridLineWidth?: number;
    crosshair?: object | boolean;
    lineWidth?: number;
    gridLineColor?: string;
    gridLineDashStyle?: string;
    labels?: {
      align?: string;
      reserveSpace?: boolean;
      x?: number;
      y?: number;
      style?: {
        fontSize?: string;
        color?: string;
        fontWeight?: string;
        lineHeight?: string;
      };
    };
    categories?: string[];
    min?: number;
    max?: number;
  };
  yAxis: {
    formatter?: any;
    crosshair?: boolean;
    gridLineColor?: string;
    gridLineDashStyle?: string;
    alignTicks?: boolean;
    title?: {
      text?: string;
    };
    labels?: {
      formatter?: () => {};
      reserveSpace?: boolean;
      padding?: number;
      x?: number;
      y?: number;
      align?: string;
      style?: {
        color?: string;
        fontWeight?: string;
        fontSize?: string;
        lineHeight?: string;
        verticalAlign?: string;
      };
    };
    lineColor?: string;
    minorGridLineWidth?: number;
    tickWidth?: number;
    gridLineWidth?: number;
    lineWidth?: number;
    categories?: string[];
    min?: number;
    max?: number;
  };
  tooltip?: {
    outside?: boolean;
    valueSuffix?: string;
    useHTML?: boolean;
    formatter?: () => {};
    shared?: boolean;
    backgroundColor?: string;
    borderColor?: string;
    borderRadius?: number;
    borderWidth?: number;
    style?: {
      fontWeight?: string;
      fontSize?: string;
      lineHeight?: string;
      whiteSpace?: string;
    };
  };
  legend?: {
    useHTML?: boolean;
    labelFormatter?: () => {} | undefined;
    align?: string;
    itemMarginTop?: number;
    navigation?: {
      activeColor?: string;
      animation?: true;
      arrowSize?: number;
      enabled?: true;
      inactiveColor?: string;
    };
    itemStyle?: {
      fontWeight?: string;
      fontSize?: string;
      lineHeight?: string;
    };
    symbolHeight?: number;
    symbolWidth?: number;
    symbolPadding?: number;
    itemDistance?: number;
  };
  series: string[];
}
interface User {
  id?: number;
  login?: string;
  offer_contract_accepted?: boolean;
  instruments?: {
    label?: string;
    link?: string;
    menu?: string;
    id?: number;
    type?: string;
    default?: any;
  }[];
}

export type { User, Pad, PadsList, reflinkPadsList, RefLink, StatValue, StatsList, StatsParams, Card, chartOptionsInterface, RefLinkActs };
