package com.hubspot.blazar.data;

import com.google.inject.AbstractModule;
import com.hubspot.blazar.data.service.BranchService;
import com.hubspot.blazar.data.service.BuildDefinitionService;
import com.hubspot.blazar.data.service.ModuleService;

public class BlazarDataModule extends AbstractModule {

  @Override
  protected void configure() {
    install(new BlazarDaoModule());

    bind(BuildDefinitionService.class);
    bind(BranchService.class);
    bind(ModuleService.class);
  }
}