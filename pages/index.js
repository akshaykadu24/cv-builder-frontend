import Head from 'next/head';
import Navbar from '@/components/Navbar';
import { getTemplateComponent, TEMPLATES } from '@/components/templates/registry';
import handleDownload from '@/components/DownloadPDF';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { parse } from 'cookie';
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

export async function getServerSideProps(context) {
  const { req } = context;
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.ResumeToken;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}fetchUserResume`, {
    method: 'GET',
    headers: { Authorization: token },
  });
  const data = await res.json();

  if (data?.success == 'true') {
    return { props: { data: data?.data || null } };
  }

  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
}

const PREVIEW_WIDTH = 800;
const PREVIEW_HEIGHT = 330;

/** Responsive dashboard thumbnail. The hidden PDF render remains unscaled. */
const ResumePreview = ({ data }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.42);
  const ActiveTemplate = getTemplateComponent(data?.template);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => setScale(Math.min(container.clientWidth / PREVIEW_WIDTH, 1));
    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{ position: 'relative', height: PREVIEW_HEIGHT, overflow: 'hidden', bgcolor: 'grey.100' }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: '0 auto auto 0',
          width: PREVIEW_WIDTH,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          pointerEvents: 'none',
          '& > div': {
            width: '100% !important',
            maxWidth: 'none !important',
            margin: '0 !important',
          },
        }}
      >
        <ActiveTemplate
          data={{
            ...data,
            fontConfig: {
              ...data?.fontConfig,
              minHeight: `${PREVIEW_HEIGHT / scale}px`,
            },
          }}
        />
      </Box>
    </Box>
  );
};

const QUICK_STEPS = [
  {
    icon: <PaletteOutlinedIcon />,
    title: 'Choose a design',
    text: 'Start with one of our professional resume templates.',
  },
  {
    icon: <EditOutlinedIcon />,
    title: 'Add your details',
    text: 'Enter your experience, education, projects and skills.',
  },
  {
    icon: <VisibilityOutlinedIcon />,
    title: 'Preview and download',
    text: 'Switch designs instantly, then export your resume as a PDF.',
  },
];

export default function Home(props) {
  const router = useRouter();
  const [resumeData, setResumeData] = useState(props?.data || []);
  const [deletingId, setDeletingId] = useState(null);
  const hasResumes = resumeData.length > 0;

  const clickDownload = (componentId, resumeName) => {
    handleDownload(componentId, resumeName);
  };

  const handleEdit = (rid, template) => {
    router.push(`/editor?template=${template}&rid=${rid}`);
  };

  const getResumeData = async (token) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}fetchUserResume`, {
        method: 'GET',
        headers: { Authorization: token },
      });
      const data = await res.json();
      setResumeData(data?.data || []);
    } catch (error) {
      console.log(error, 'error fetching resume data');
    }
  };

  const handleDelete = async (rid) => {
    const cookieToken = document?.cookie?.split('; ').find((cookie) => cookie.startsWith('ResumeToken='));
    const token = cookieToken?.split('=')[1];
    setDeletingId(rid);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}deleteResume/${rid}`, {
        method: 'DELETE',
        headers: { Authorization: token },
      });
      const data = await res.json();
      await getResumeData(token);
      alert(data?.msg);
    } catch (error) {
      console.log('delete error', error);
      alert('Something went wrong, data not deleted');
    } finally {
      setDeletingId(null);
    }
  };

  const handleClickOnNewResume = () => router.push('/layout');

  return (
    <>
      <Head>
        <title>My Resumes | Resume Builder</title>
        <meta name="description" content="Create, edit and download professional resumes." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
        <Navbar />

        <Container maxWidth="xl" sx={{ py: { xs: 2.5, md: 4 } }}>
          {/* Welcome banner */}
          <Paper
            sx={{
              position: 'relative',
              overflow: 'hidden',
              p: { xs: 2.5, sm: 3.5, md: 4 },
              borderRadius: 4,
              color: 'common.white',
              background: 'linear-gradient(135deg, #1565c0 0%, #3949ab 60%, #6a1b9a 100%)',
              boxShadow: '0 14px 36px -14px rgba(21,101,192,.50)',
              '&::before': {
                content: '""',
                position: 'absolute',
                width: 260,
                height: 260,
                borderRadius: '50%',
                top: -150,
                right: -50,
                bgcolor: 'rgba(255,255,255,.12)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                width: 150,
                height: 150,
                borderRadius: '50%',
                bottom: -105,
                right: 180,
                bgcolor: 'rgba(255,255,255,.08)',
              },
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2.5}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="space-between"
              sx={{ position: 'relative', zIndex: 1 }}
            >
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <AutoAwesomeOutlinedIcon />
                  <Typography variant="overline" fontWeight={700} letterSpacing={1.5}>
                    Your career story starts here
                  </Typography>
                </Stack>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{ fontSize: { xs: 25, sm: 31, md: 36 }, lineHeight: 1.15 }}
                >
                  {hasResumes ? 'Welcome back!' : 'Welcome to Resume Builder!'}
                </Typography>
                <Typography sx={{ mt: 1, maxWidth: 650, color: 'rgba(255,255,255,.88)', lineHeight: 1.55 }}>
                  {hasResumes
                    ? `You have ${resumeData.length} ${resumeData.length === 1 ? 'resume' : 'resumes'} ready to edit, improve or download.`
                    : 'Create a polished resume in a few simple steps. Pick a design, add your information and watch the preview update instantly.'}
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={handleClickOnNewResume}
                sx={{
                  flexShrink: 0,
                  alignSelf: { xs: 'stretch', sm: 'center' },
                  px: 2.5,
                  py: 1.25,
                  borderRadius: 2.5,
                  bgcolor: 'common.white',
                  color: 'primary.main',
                  textTransform: 'none',
                  fontWeight: 800,
                  boxShadow: '0 7px 18px rgba(0,0,0,.18)',
                  '&:hover': { bgcolor: 'grey.100', transform: 'translateY(-1px)' },
                }}
              >
                Create New Resume
              </Button>
            </Stack>
          </Paper>

          {hasResumes ? (
            <>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                sx={{ mt: { xs: 3, md: 4 }, mb: 2 }}
              >
                <Box>
                  <Typography variant="h5" fontWeight={800}>My Resumes</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Continue editing or download your latest version.
                  </Typography>
                </Box>
                <Chip
                  icon={<DescriptionOutlinedIcon />}
                  label={`${resumeData.length} ${resumeData.length === 1 ? 'resume' : 'resumes'}`}
                  color="primary"
                  variant="outlined"
                />
              </Stack>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0,1fr))', xl: 'repeat(3, minmax(0,1fr))' },
                  gap: { xs: 2, md: 3 },
                }}
              >
                {resumeData.map((resume, index) => {
                  const ActiveTemplate = getTemplateComponent(resume.template);
                  const templateLabel = TEMPLATES.find((item) => item.value === resume.template)?.label || 'Classic';
                  const previewId = `resume-hidden-render${index}`;

                  return (
                    <Paper
                      key={resume._id || index}
                      sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0 2px 8px rgba(16,24,40,.06), 0 16px 32px -18px rgba(16,24,40,.18)',
                        transition: 'transform .25s ease, box-shadow .25s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 4px 10px rgba(16,24,40,.08), 0 22px 42px -18px rgba(16,24,40,.26)',
                        },
                      }}
                    >
                      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ p: 2 }}>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography fontWeight={800} noWrap>{resume.resumeName || 'Untitled Resume'}</Typography>
                          <Typography variant="caption" color="text.secondary">Last saved resume</Typography>
                        </Box>
                        <Chip size="small" label={templateLabel} color="primary" variant="outlined" />
                      </Stack>

                      <Divider />
                      <ResumePreview data={resume} />
                      <Divider />

                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                          gap: 1,
                          p: 1.5,
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<EditOutlinedIcon />}
                          onClick={() => handleEdit(resume?._id, resume?.template)}
                          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="success"
                          size="small"
                          startIcon={<DownloadOutlinedIcon />}
                          onClick={() => clickDownload(previewId, resume?.resumeName)}
                          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                        >
                          Download
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          loading={deletingId === resume?._id}
                          startIcon={<DeleteOutlineIcon />}
                          onClick={() => handleDelete(resume?._id)}
                          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                        >
                          Delete
                        </Button>
                      </Box>

                      {/* Full-size off-screen render used only by html2canvas/PDF. */}
                      <div id={previewId} style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                        <div
                          style={{
                            width: '700px',
                            fontSize: '10px',
                            transformOrigin: 'top left',
                            cursor: 'pointer',
                            border: '2px solid #ccc',
                            borderRadius: '8px',
                            padding: '10px',
                            backgroundColor: 'white',
                          }}
                        >
                          <ActiveTemplate data={resume} />
                        </div>
                      </div>
                    </Paper>
                  );
                })}
              </Box>
            </>
          ) : (
            /* New-user empty state */
            <Paper
              sx={{
                mt: { xs: 3, md: 4 },
                p: { xs: 2.5, sm: 4, md: 5 },
                borderRadius: 4,
                textAlign: 'center',
                border: '1px dashed',
                borderColor: 'primary.light',
                boxShadow: '0 12px 30px -18px rgba(16,24,40,.22)',
              }}
            >
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  display: 'grid',
                  placeItems: 'center',
                  mx: 'auto',
                  mb: 2,
                  borderRadius: '50%',
                  color: 'primary.main',
                  bgcolor: 'rgba(25,118,210,.09)',
                }}
              >
                <DescriptionOutlinedIcon sx={{ fontSize: 36 }} />
              </Box>

              <Typography variant="h5" fontWeight={800}>Create your first resume</Typography>
              <Typography color="text.secondary" sx={{ mt: 1, mx: 'auto', maxWidth: 600 }}>
                You don’t have any saved resumes yet. Here’s how to create one that stands out.
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                  gap: 2,
                  maxWidth: 900,
                  mx: 'auto',
                  my: 3.5,
                }}
              >
                {QUICK_STEPS.map((step, index) => (
                  <Paper key={step.title} variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'left' }}>
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          flexShrink: 0,
                          display: 'grid',
                          placeItems: 'center',
                          borderRadius: 2,
                          color: 'primary.main',
                          bgcolor: 'rgba(25,118,210,.08)',
                        }}
                      >
                        {step.icon}
                      </Box>
                      <Box>
                        <Typography variant="caption" color="primary.main" fontWeight={800}>
                          STEP {index + 1}
                        </Typography>
                        <Typography fontWeight={800}>{step.title}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {step.text}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Box>

              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={handleClickOnNewResume}
                sx={{ px: 3, py: 1.2, borderRadius: 2.5, textTransform: 'none', fontWeight: 800 }}
              >
                Choose a Template
              </Button>
            </Paper>
          )}
        </Container>
      </Box>
    </>
  );
}
