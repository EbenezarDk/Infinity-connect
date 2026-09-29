import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import { getContactById } from '../../data/contacts';
import { getConversationsForContact } from '../../data/conversations';
import { CustomerContextPanel } from '../../components/customer/CustomerContextPanel';
import { EmptyState } from '../../components/common/EmptyState';

export function ContactProfilePage() {
  const { contactId } = useParams<{ contactId: string }>();
  const navigate = useNavigate();
  const contact = getContactById(contactId);

  if (!contact) {
    return (
      <Box sx={{ height: '100%' }}>
        <EmptyState title="Contact not found" description="This customer profile may have been removed or the link is outdated." />
      </Box>
    );
  }

  const conversations = getConversationsForContact(contact.id);
  const mostRecent = conversations[0];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: { xs: 2, md: 3 }, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <IconButton size="small" onClick={() => navigate('/contacts')} aria-label="Back to contacts">
          <ArrowBackRoundedIcon fontSize="small" />
        </IconButton>
        <Typography variant="h4" sx={{ flex: 1 }}>
          Customer profile
        </Typography>
        {mostRecent && (
          <Button
            size="small"
            variant="contained"
            startIcon={<ForumRoundedIcon fontSize="small" />}
            onClick={() => navigate(`/inbox?conversation=${mostRecent.id}`)}
          >
            Go to latest conversation
          </Button>
        )}
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, maxWidth: 720, width: '100%', mx: 'auto' }}>
        <CustomerContextPanel contactId={contact.id} hideProfileLink />
      </Box>
    </Box>
  );
}
