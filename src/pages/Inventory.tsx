import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/data/mockData';
import { Plus, Search, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatCard from '@/components/dashboard/StatCard';

export default function InventoryPage() {
  const { products, addProduct } = useApp();
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [stock, setStock] = useState('');
  const [minStock, setMinStock] = useState('');
  const [unit, setUnit] = useState('piece');

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));
  const totalItems = products.length;
  const totalValue = products.reduce((s, p) => s + p.stock * p.sellPrice, 0);
  const lowStockItems = products.filter(p => p.stock <= p.minStock);
  const totalProfit = products.reduce((s, p) => s + (p.sellPrice - p.buyPrice) * p.stock, 0);

  const handleSubmit = () => {
    if (!name.trim()) return;
    addProduct({
      name: name.trim(), sku: sku.trim(), category: category.trim(),
      buyPrice: Number(buyPrice) || 0, sellPrice: Number(sellPrice) || 0,
      stock: Number(stock) || 0, minStock: Number(minStock) || 5,
      unit, isActive: true,
    });
    setShowDialog(false);
    setName(''); setSku(''); setCategory(''); setBuyPrice(''); setSellPrice(''); setStock(''); setMinStock(''); setUnit('piece');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">Inventory</h1>
          <p className="text-muted-foreground mt-1">Manage products, stock levels, and pricing</p>
        </div>
        <Button onClick={() => setShowDialog(true)} className="gap-2"><Plus className="h-4 w-4" /> Add Product</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Products" value={String(totalItems)} icon={Package} delay={0} />
        <StatCard title="Stock Value" value={formatCurrency(totalValue)} icon={TrendingUp} variant="cash-in" delay={50} />
        <StatCard title="Low Stock Items" value={String(lowStockItems.length)} icon={AlertTriangle} variant={lowStockItems.length > 0 ? 'warning' : 'default'} delay={100} />
        <StatCard title="Potential Profit" value={formatCurrency(totalProfit)} icon={TrendingUp} delay={150} />
      </div>

      {lowStockItems.length > 0 && (
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <p className="text-sm font-semibold text-warning">Low Stock Alerts</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map(p => (
              <span key={p.id} className="text-xs bg-warning/10 text-warning px-2.5 py-1 rounded-full font-medium">
                {p.name}: {p.stock} {p.unit}s left
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Product</th>
                <th className="text-left p-3 font-medium text-muted-foreground">SKU</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Category</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Buy Price</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Sell Price</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Stock</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p, i) => {
                const margin = ((p.sellPrice - p.buyPrice) / p.buyPrice * 100).toFixed(1);
                const isLow = p.stock <= p.minStock;
                return (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3 text-muted-foreground">{p.sku}</td>
                    <td className="p-3"><span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">{p.category}</span></td>
                    <td className="p-3 text-right">{formatCurrency(p.buyPrice)}</td>
                    <td className="p-3 text-right">{formatCurrency(p.sellPrice)}</td>
                    <td className="p-3 text-right">
                      <span className={`font-medium ${isLow ? 'text-cash-out' : ''}`}>
                        {p.stock} {p.unit}s
                      </span>
                      {isLow && <span className="ml-1 text-xs text-cash-out">⚠</span>}
                    </td>
                    <td className="p-3 text-right text-cash-in font-medium">{margin}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="font-display">Add Product</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Product Name *</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Basmati Rice (25kg)" /></div>
              <div><Label>SKU</Label><Input value={sku} onChange={e => setSku(e.target.value)} placeholder="GRC-001" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Category</Label><Input value={category} onChange={e => setCategory(e.target.value)} placeholder="Grocery" /></div>
              <div>
                <Label>Unit</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="piece">Piece</SelectItem>
                    <SelectItem value="bag">Bag</SelectItem>
                    <SelectItem value="bottle">Bottle</SelectItem>
                    <SelectItem value="pack">Pack</SelectItem>
                    <SelectItem value="kg">Kg</SelectItem>
                    <SelectItem value="liter">Liter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Buy Price (₹)</Label><Input type="number" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} /></div>
              <div><Label>Sell Price (₹)</Label><Input type="number" value={sellPrice} onChange={e => setSellPrice(e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Current Stock</Label><Input type="number" value={stock} onChange={e => setStock(e.target.value)} /></div>
              <div><Label>Min Stock Alert</Label><Input type="number" value={minStock} onChange={e => setMinStock(e.target.value)} placeholder="5" /></div>
            </div>
            <Button onClick={handleSubmit} className="w-full">Add Product</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
