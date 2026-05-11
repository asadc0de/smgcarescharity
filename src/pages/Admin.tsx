import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Image as ImageIcon, Save, X, Loader2 } from "lucide-react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LogOut, Lock } from "lucide-react";

interface Event {
  id?: string;
  title: string;
  year: string;
  tag: string;
  body: string;
  raised?: string;
  charityPartner?: string;
  location?: string;
  eventDate?: string;
  to: string;
  image: string;
  gallery?: string[];
  secondary?: boolean;
  createdAt: any;
}

const ADMIN_EMAIL = "smgcarescharity@gmail.com";

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event>({
    title: "",
    year: new Date().getFullYear().toString(),
    tag: "Upcoming",
    body: "",
    raised: "",
    charityPartner: "",
    location: "",
    eventDate: "",
    cta: "Register Now",
    to: "/golf",
    image: "",
    gallery: [],
    secondary: false,
    createdAt: new Date(),
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === ADMIN_EMAIL) {
        setUser(currentUser);
        fetchEvents();
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back, Admin!");
    } catch (error: any) {
      toast.error("Login failed. Check credentials.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out successfully.");
  };

  const fetchEvents = async () => {
    const isConfigValid = import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== "YOUR_API_KEY";
    console.log("Firebase config check:", isConfigValid ? "Valid" : "Missing/Placeholder");
    
    if (!isConfigValid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting to fetch events from Firestore...");
      const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      console.log("Firestore response received. Docs count:", querySnapshot.size);
      
      const fetchedEvents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
      setEvents(fetchedEvents);
    } catch (error: any) {
      console.error("Firestore Error:", error);
      toast.error(`Database Error: ${error.message || "Failed to connect"}`);
      if (error.code === 'permission-denied') {
        toast.error("Check your Firebase Firestore Rules (must allow read/write).");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    
    // Safety fallback: if stuck in loading for 10s, release it
    const timer = setTimeout(() => {
      setLoading(prev => {
        if (prev) console.warn("Loading timed out after 10 seconds.");
        return false;
      });
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleUpload = () => {
    // @ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          setCurrentEvent(prev => ({ ...prev, image: result.info.secure_url }));
          toast.success("Image uploaded successfully!");
        }
      }
    );
    widget.open();
  };

  const handleGalleryUpload = () => {
    // @ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          setCurrentEvent(prev => ({ 
            ...prev, 
            gallery: [...(prev.gallery || []), result.info.secure_url] 
          }));
          toast.success("Gallery image added!");
        }
      }
    );
    widget.open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing && currentEvent.id) {
        const eventRef = doc(db, "events", currentEvent.id);
        await updateDoc(eventRef, { ...currentEvent });
        toast.success("Event updated successfully!");
      } else {
        await addDoc(collection(db, "events"), {
          ...currentEvent,
          createdAt: new Date(),
        });
        toast.success("Event created successfully!");
      }
      setIsEditing(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteDoc(doc(db, "events", id));
      toast.success("Event deleted!");
      fetchEvents();
    } catch (error) {
      toast.error("Delete failed.");
    }
  };

  const resetForm = () => {
    setCurrentEvent({
      title: "",
      year: new Date().getFullYear().toString(),
      tag: "Upcoming",
      body: "",
      raised: "",
      charityPartner: "",
      location: "",
      eventDate: "",
      cta: "Register Now",
      to: "/golf",
      image: "",
      gallery: [],
      secondary: false,
      createdAt: new Date(),
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <PageShell>
        <div className="min-h-[80vh] flex items-center justify-center px-4 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md p-8 rounded-[2.5rem] bg-white border border-border shadow-elegant mt-11 mb-7"
          >
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-accent-soft rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-soft">
                <Lock className="text-accent" size={32} />
              </div>
              <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">Admin Login</h1>
              <p className="text-muted-foreground mt-2 text-sm font-medium">Access your event management tools</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</label>
                <Input 
                  type="email"
                  placeholder="admin@smgcares.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl bg-surface border-border h-14 focus:border-accent focus:ring-1 focus:ring-accent transition-all px-5 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Password</label>
                <Input 
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-2xl bg-surface border-border h-14 focus:border-accent focus:ring-1 focus:ring-accent transition-all px-5 text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-white font-bold text-lg shadow-lg shadow-accent/20 transition-transform active:scale-[0.98] hover-lift">
                Sign In
              </Button>
            </form>
          </motion.div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="pt-32 pb-20 bg-background min-h-screen text-foreground">
        <div className="container-x">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h1 className="font-display text-6xl tracking-tighter mb-4 text-foreground">Event Manager</h1>
              <p className="text-muted-foreground text-lg">Manage your foundation's impact and upcoming events.</p>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="ghost"
                onClick={handleLogout}
                className="rounded-full h-14 w-14 bg-white border border-border hover:bg-red-50 hover:border-red-200 hover:text-red-500 group transition-all shadow-sm"
                title="Log Out"
              >
                <LogOut size={24} className="group-hover:scale-110 transition-transform" />
              </Button>
              {!isEditing && (
                <Button 
                  onClick={() => { resetForm(); setIsEditing(true); }}
                  className="rounded-full h-14 px-8 bg-accent hover:bg-accent/90 text-white font-bold font-display text-lg flex items-center gap-2 shadow-lg shadow-accent/20 hover-lift"
                >
                  <Plus size={24} /> New Event
                </Button>
              )}
            </div>
          </div>

          {isEditing ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-border rounded-3xl p-8 max-w-2xl mx-auto shadow-elegant"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-display text-foreground">{currentEvent.id ? "Edit Event" : "Create New Event"}</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)} className="rounded-full hover:bg-surface">
                  <X className="text-muted-foreground" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Event Title</label>
                    <Input 
                      value={currentEvent.title}
                      onChange={e => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                      placeholder="Annual Charity Outing"
                      className="bg-surface border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent text-foreground"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Year</label>
                    <Input 
                      value={currentEvent.year}
                      onChange={e => setCurrentEvent({ ...currentEvent, year: e.target.value })}
                      placeholder="2026"
                      className="bg-surface border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Tag</label>
                    <Input 
                      value={currentEvent.tag}
                      onChange={e => setCurrentEvent({ ...currentEvent, tag: e.target.value })}
                      placeholder="Upcoming / Past Event"
                      className="bg-surface border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Event Date</label>
                    <Input 
                      value={currentEvent.eventDate || ""}
                      onChange={e => setCurrentEvent({ ...currentEvent, eventDate: e.target.value })}
                      placeholder="e.g. Monday September 28th 2026"
                      className="bg-surface border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Charity Partner</label>
                    <Input 
                      value={currentEvent.charityPartner || ""}
                      onChange={e => setCurrentEvent({ ...currentEvent, charityPartner: e.target.value })}
                      placeholder="e.g. Fight CRC - https://..."
                      className="bg-surface border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Event Location</label>
                    <Input 
                      value={currentEvent.location || ""}
                      onChange={e => setCurrentEvent({ ...currentEvent, location: e.target.value })}
                      placeholder="e.g. The Muttontown Club"
                      className="bg-surface border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Raised Amount</label>
                    <Input 
                      value={currentEvent.raised || ""}
                      onChange={e => setCurrentEvent({ ...currentEvent, raised: e.target.value })}
                      placeholder="$XXX,XXX"
                      className="bg-surface border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">CTA Text</label>
                    <Input 
                      value={currentEvent.cta}
                      onChange={e => setCurrentEvent({ ...currentEvent, cta: e.target.value })}
                      placeholder="Register Now"
                      className="bg-surface border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Link (Route)</label>
                    <Input 
                      value={currentEvent.to}
                      onChange={e => setCurrentEvent({ ...currentEvent, to: e.target.value })}
                      placeholder="/golf"
                      className="bg-surface border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Description</label>
                  <Textarea 
                    value={currentEvent.body}
                    onChange={e => setCurrentEvent({ ...currentEvent, body: e.target.value })}
                    placeholder="Tell the story of this event..."
                    className="bg-surface border-border rounded-xl min-h-[120px] focus:border-accent focus:ring-1 focus:ring-accent text-foreground"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Event Image</label>
                  <div className="flex gap-4 items-center">
                    {currentEvent.image && (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-border shadow-sm">
                        <img src={currentEvent.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <Button 
                      type="button"
                      onClick={handleUpload}
                      variant="outline"
                      className="flex-1 h-20 border-dashed border-border hover:border-accent bg-transparent hover:bg-surface rounded-xl text-muted-foreground hover:text-foreground transition-all"
                    >
                      <ImageIcon className="mr-2 opacity-50" />
                      {currentEvent.image ? "Change Image" : "Upload Event Image"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Gallery Images</label>
                  
                  {currentEvent.gallery && currentEvent.gallery.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      {currentEvent.gallery.map((img, idx) => (
                        <div key={idx} className="relative w-full aspect-square rounded-xl overflow-hidden border border-border shadow-sm group">
                          <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setCurrentEvent(prev => ({
                              ...prev,
                              gallery: prev.gallery?.filter((_, i) => i !== idx)
                            }))}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button 
                    type="button"
                    onClick={handleGalleryUpload}
                    variant="outline"
                    className="w-full h-14 border-dashed border-border hover:border-accent bg-transparent hover:bg-surface rounded-xl text-muted-foreground hover:text-foreground transition-all"
                  >
                    <ImageIcon className="mr-2 opacity-50" />
                    Add Gallery Image
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    checked={currentEvent.secondary}
                    onChange={e => setCurrentEvent({ ...currentEvent, secondary: e.target.checked })}
                    className="w-4 h-4 rounded border-border bg-surface text-accent focus:ring-accent"
                  />
                  <label className="text-sm text-muted-foreground font-medium">Mark as secondary (smaller card)</label>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-14 bg-accent hover:bg-accent/90 text-white rounded-xl font-display text-lg shadow-lg shadow-accent/20 hover-lift"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Save className="mr-2" /> {currentEvent.id ? "Update Event" : "Create Event"}</>}
                </Button>
              </form>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" size={40} /></div>
              ) : !(import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== "YOUR_API_KEY") ? (
                <div className="text-center py-20 border border-dashed border-border rounded-3xl bg-white shadow-sm">
                  <h3 className="text-xl font-display mb-4 text-foreground">Configuration Required</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    To start managing events, please update your <strong>.env</strong> file with your Firebase and Cloudinary credentials.
                  </p>
                  <div className="inline-block p-4 bg-surface border border-border rounded-xl text-left font-mono text-xs text-muted-foreground mb-8">
                    VITE_FIREBASE_API_KEY=...<br/>
                    VITE_FIREBASE_PROJECT_ID=...<br/>
                    VITE_CLOUDINARY_CLOUD_NAME=...
                  </div>
                  <br />
                  <Button 
                    variant="outline" 
                    onClick={() => fetchEvents()}
                    className="rounded-full border-border hover:bg-surface text-foreground"
                  >
                    Check Connection Again
                  </Button>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-border bg-white rounded-3xl shadow-sm">
                  <p className="text-muted-foreground font-medium">No events found. Start by creating one!</p>
                </div>
              ) : (
                events.map(event => (
                  <motion.div 
                    key={event.id}
                    layout
                    className="flex items-center gap-6 p-4 bg-white border border-border rounded-2xl group hover:shadow-soft transition-all"
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-border shadow-sm">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent">{event.tag}</span>
                        <span className="text-muted-foreground/30">•</span>
                        <span className="text-xs text-muted-foreground font-medium">{event.year}</span>
                      </div>
                      <h3 className="text-xl font-display text-foreground">{event.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => { setCurrentEvent(event); setIsEditing(true); }}
                        className="rounded-full hover:bg-surface text-muted-foreground hover:text-accent"
                      >
                        <Pencil size={18} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(event.id!)}
                        className="rounded-full hover:bg-red-50 text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
};

export default Admin;
