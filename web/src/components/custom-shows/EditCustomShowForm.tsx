import { useTunarrApi } from '@/hooks/useTunarrApi';
import { queryClient } from '@/queryClient';
import useStore from '@/store';
import {
  clearCurrentCustomShow,
  moveProgramInCustomShow,
  updateCurrentCustomShow,
} from '@/store/customShowEditor/actions.ts';
import { removeCustomShowProgram } from '@/store/entityEditor/util';
import { UICustomShowProgram } from '@/types';
import { Tv } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { CustomShow } from '@tunarr/types';
import { useCallback, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import ChannelProgrammingList from '../channel_config/ChannelProgrammingList';

type CustomShowForm = {
  id?: string;
  name: string;
};

type Props = {
  customShow: CustomShow;
  customShowPrograms: UICustomShowProgram[];
  isNew: boolean;
};

export function EditCustomShowsForm({
  customShow,
  customShowPrograms,
  isNew,
}: Props) {
  const apiClient = useTunarrApi();
  const navigate = useNavigate();
  const customShowProgrammingChanged = useStore(
    (s) => s.customShowEditor.dirty.programs,
  );

  const {
    control,
    reset,
    handleSubmit,
    getValues,
    formState: { isValid, isDirty },
  } = useForm<CustomShowForm>({
    defaultValues: {
      name: customShow.name ?? '',
    },
  });

  useEffect(() => {
    reset({
      name: customShow.name,
    });
  }, [customShow, reset]);

  const saveShowMutation = useMutation({
    mutationKey: ['custom-shows', isNew ? 'new' : customShow.id],
    mutationFn: async (
      data: CustomShowForm & { programs: UICustomShowProgram[] },
    ) => {
      if (isNew) {
        return apiClient.createCustomShow({
          name: data.name,
          programs: data.programs,
        });
      } else {
        return apiClient.updateCustomShow(
          { name: data.name, programs: data.programs },
          { params: { id: customShow.id } },
        );
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['custom-shows'],
        exact: false,
      });
      clearCurrentCustomShow();
      navigate({ to: '/library/custom-shows' }).catch(console.warn);
    },
  });

  const onCancel = useCallback(() => {
    navigate({ to: '/library/custom-shows' }).catch(console.warn);
  }, [navigate]);

  const saveCustomShow: SubmitHandler<CustomShowForm> = (
    data: CustomShowForm,
  ) => {
    saveShowMutation.mutate({ ...data, programs: customShowPrograms });
  };

  const navToProgramming = () => {
    if (isNew) {
      updateCurrentCustomShow(getValues());
    }
    navigate({
      to: isNew
        ? '/library/custom-shows/new/programming'
        : `/library/custom-shows/$customShowId/programming`,
      params: { customShowId: customShow?.id },
    }).catch(console.warn);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(saveCustomShow)}>
      <Stack gap={2}>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextField margin="normal" fullWidth label="Name" {...field} />
          )}
        />
        <Divider />
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ flex: 1 }}>
              Programming
            </Typography>
            <Tooltip
              title="Add TV Shows or Movies to custom show"
              placement="right"
            >
              <Button
                disableRipple
                component="button"
                onClick={() => navToProgramming()}
                startIcon={<Tv />}
                variant="contained"
              >
                Add Media
              </Button>
            </Tooltip>
          </Box>
          <Paper>
            <ChannelProgrammingList
              type="selector"
              programListSelector={(s) => s.customShowEditor.programList}
              moveProgram={moveProgramInCustomShow}
              deleteProgram={removeCustomShowProgram}
              virtualListProps={{
                width: '100%',
                height: 600,
                itemSize: 35, //smallViewport ? 70 : 35,
              }}
            />
          </Paper>
        </Box>
        <Stack
          spacing={2}
          direction="row"
          justifyContent="right"
          sx={{ mt: 2 }}
        >
          <Button onClick={() => onCancel()}>Cancel</Button>
          <Button
            disabled={
              saveShowMutation.isPending ||
              !isValid ||
              (!isDirty && !customShowProgrammingChanged) ||
              customShowPrograms.length === 0
            }
            variant="contained"
            type="submit"
          >
            Save
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
