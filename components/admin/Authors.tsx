"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Edit, Twitter, Linkedin, Facebook, Loader2, User2, Power, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import { useToast } from '@/hooks/use-toast';
import { AuthorService, type Author } from '@/services/authorService';
import { StorageService } from '@/services/storageService';

const Authors: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    bio: '',
    avatar_url: '',
    twitter_url: '',
    linkedin_url: '',
    facebook_url: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; author: Author | null }>({
    open: false,
    author: null,
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await AuthorService.list();
        setAuthors(data);
      } catch (e) {
        console.error(e);
        toast({ title: 'Failed to load authors', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return authors;
    return authors.filter(a => a.name.toLowerCase().includes(q));
  }, [authors, search]);

  const resetForm = () => {
    setForm({ name: '', bio: '', avatar_url: '', twitter_url: '', linkedin_url: '', facebook_url: '' });
    setSelectedImage(null);
    setImagePreview('');
    setEditingAuthor(null);
  };

  const openEditDialog = (author: Author) => {
    setEditingAuthor(author);
    setForm({
      name: author.name,
      bio: author.bio || '',
      avatar_url: author.avatar_url || '',
      twitter_url: author.twitter_url || '',
      linkedin_url: author.linkedin_url || '',
      facebook_url: author.facebook_url || '',
    });
    setImagePreview(author.avatar_url || '');
    setOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setOpen(true);
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('📁 Avatar file selected:', file.name, file.type);
      setSelectedImage(file);
      
      try {
        setUploadingImage(true);
        setImagePreview('uploading...');
        
        // Try to upload to Supabase Storage first
        try {
          const publicUrl = await StorageService.uploadAvatar(file);
          console.log('🖼️ Avatar uploaded to Storage, URL:', publicUrl);
          setImagePreview(publicUrl);
          setForm(prev => ({ ...prev, avatar_url: publicUrl }));
          return;
        } catch (storageError) {
          console.warn('⚠️ Storage upload failed, falling back to base64:', storageError);
          
          // Fallback to base64 if Storage fails
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            console.log('🖼️ Avatar converted to base64, length:', result.length);
            setImagePreview(result);
            setForm(prev => ({ ...prev, avatar_url: result }));
          };
          reader.readAsDataURL(file);
        }
        
      } catch (error) {
        console.error('❌ Error processing avatar:', error);
        toast({
          title: "Avatar Error",
          description: "Failed to process avatar image. Please try again.",
          variant: "destructive",
        });
        
        // Reset on error
        setSelectedImage(null);
        setImagePreview('');
        setForm(prev => ({ ...prev, avatar_url: '' }));
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleImageUrlChange = (url: string) => {
    // Clear selected file when manual URL is entered
    setSelectedImage(null);
    setImagePreview(url);
    setForm(prev => ({ ...prev, avatar_url: url }));
  };

  const saveAuthor = async () => {
    if (!form.name.trim()) {
      toast({ title: 'Name is required', variant: 'destructive' });
      return;
    }
    try {
      setSubmitting(true);
      
      if (editingAuthor) {
        // Update existing author
        const updated = await AuthorService.update(editingAuthor.id, {
          name: form.name.trim(),
          bio: form.bio || null,
          avatar_url: form.avatar_url || null,
          twitter_url: form.twitter_url || null,
          linkedin_url: form.linkedin_url || null,
          facebook_url: form.facebook_url || null,
        });
        setAuthors(prev => prev.map(a => a.id === editingAuthor.id ? updated! : a));
        toast({ title: 'Author updated' });
      } else {
        // Create new author
        const created = await AuthorService.create({
          name: form.name.trim(),
          bio: form.bio || null,
          avatar_url: form.avatar_url || null,
          twitter_url: form.twitter_url || null,
          linkedin_url: form.linkedin_url || null,
          facebook_url: form.facebook_url || null,
          is_active: true,
        });
        setAuthors(prev => [created, ...prev]);
        toast({ title: 'Author created' });
      }
      
      setOpen(false);
      resetForm();
    } catch (e) {
      console.error(e);
      toast({ 
        title: editingAuthor ? 'Failed to update author' : 'Failed to create author', 
        variant: 'destructive' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (author: Author) => {
    const target = !author.is_active;
    try {
      await AuthorService.deactivate(author.id, target);
      setAuthors(prev => prev.map(a => a.id === author.id ? { ...a, is_active: target } : a));
      toast({ title: target ? 'Author activated' : 'Author deactivated' });
    } catch (e) {
      console.error(e);
      toast({ title: 'Failed to update author', variant: 'destructive' });
    }
  };

  const openDeleteDialog = (author: Author) => {
    setDeleteDialog({ open: true, author });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, author: null });
    setDeleting(false);
  };

  const confirmDelete = async () => {
    if (!deleteDialog.author) return;
    
    try {
      setDeleting(true);
      console.log('🗑️ Deleting author:', deleteDialog.author.name, 'ID:', deleteDialog.author.id);
      
      const success = await AuthorService.delete(deleteDialog.author.id);
      
      if (success) {
        setAuthors(prev => prev.filter(a => a.id !== deleteDialog.author!.id));
        toast({ title: 'Author deleted successfully' });
        closeDeleteDialog();
      } else {
        throw new Error('Delete operation failed');
      }
    } catch (e) {
      console.error('❌ Delete error:', e);
      const errorMessage = e instanceof Error ? e.message : 'Failed to delete author';
      
      if (errorMessage.includes('being used in blog posts')) {
        toast({ 
          title: 'Cannot Delete Author', 
          description: 'This author is being used in blog posts. Please update or remove the posts first.',
          variant: 'destructive' 
        });
      } else {
        toast({ 
          title: 'Failed to delete author', 
          description: errorMessage,
          variant: 'destructive' 
        });
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2"><Loader2 className="h-6 w-6 animate-spin" /><span>Loading authors...</span></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Authors Management</h1>
          <p className="text-gray-600">Manage blog authors and their profiles</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" /> New Author
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Input placeholder="Search authors..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filtered.map((a) => (
          <Card key={a.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-start">
                {/* Avatar Section */}
                <div className="p-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={a.avatar_url || ''} alt={a.name} />
                    <AvatarFallback className="text-lg">
                      {a.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                {/* Content Section */}
                <div className="flex-1 p-6 pl-0">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{a.name}</h3>
                      {a.bio && (
                        <p className="text-gray-600 mt-2 leading-relaxed max-w-2xl">
                          {a.bio}
                        </p>
                      )}
                    </div>
                    
                    {/* Social Links */}
                    <div className="flex gap-2">
                      {a.twitter_url && (
                        <a 
                          href={a.twitter_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Twitter className="h-4 w-4 text-gray-600" />
                        </a>
                      )}
                      {a.linkedin_url && (
                        <a 
                          href={a.linkedin_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Linkedin className="h-4 w-4 text-gray-600" />
                        </a>
                      )}
                      {a.facebook_url && (
                        <a 
                          href={a.facebook_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="w-8 h-8 rounded-md border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Facebook className="h-4 w-4 text-gray-600" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="p-6 pl-0 flex items-start gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openEditDialog(a)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => openDeleteDialog(a)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              No authors found
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAuthor ? 'Edit Author' : 'Create New Author'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Avatar Upload Section */}
            <div className="space-y-4">
              <Label>Avatar</Label>
              <div className="flex items-center space-x-4">
                {/* Avatar Preview */}
                <div className="flex-shrink-0">
                  {imagePreview ? (
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={imagePreview} alt="Preview" />
                      <AvatarFallback className="text-lg">Preview</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                      <User2 className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Upload Options */}
                <div className="flex-1 space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview('');
                        setForm(prev => ({ ...prev, avatar_url: '' }));
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Or enter image URL manually
                  </div>
                  <Input
                    placeholder="https://example.com/avatar.jpg"
                    value={form.avatar_url}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input 
                  id="name" 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  placeholder="Author name" 
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  value={form.bio} 
                  onChange={(e) => setForm({ ...form, bio: e.target.value })} 
                  placeholder="Brief description about the author..."
                  rows={3}
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Social Links</Label>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label>Twitter URL</Label>
                  <Input 
                    value={form.twitter_url} 
                    onChange={(e) => setForm({ ...form, twitter_url: e.target.value })} 
                    placeholder="https://twitter.com/username" 
                  />
                </div>
                <div>
                  <Label>LinkedIn URL</Label>
                  <Input 
                    value={form.linkedin_url} 
                    onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} 
                    placeholder="https://linkedin.com/in/username" 
                  />
                </div>
                <div>
                  <Label>Facebook URL</Label>
                  <Input 
                    value={form.facebook_url} 
                    onChange={(e) => setForm({ ...form, facebook_url: e.target.value })} 
                    placeholder="https://facebook.com/username" 
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={saveAuthor} disabled={submitting || uploadingImage}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingAuthor ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editingAuthor ? 'Update Author' : 'Create Author'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialog.open}
        onOpenChange={(open) => !open && closeDeleteDialog()}
        onConfirm={confirmDelete}
        title="Delete Author"
        description={`Are you sure you want to delete "${deleteDialog.author?.name}"? This action cannot be undone and will remove the author from all blog posts.`}
        confirmText="Delete Author"
        cancelText="Cancel"
        variant="destructive"
        loading={deleting}
      />
    </div>
  );
};

export default Authors;



